
import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { getCurrentUser } from "@/lib/auth/currentUser";
import prisma from "@/lib/prisma/prisma";
import z from "zod";

const PAGE_SIZE = 20;

type RouteContext = {
    params: Promise<{
        short_id: string;
    }>;
};

type CursorRow = {
    id: string;
    created_at: Date;
};

type CommentRow = {
    id: string;
    content: string;
    created_at: Date;
    parent_comment_id: string | null;

    users: {
        username: string;
    };

    comments: {
        users: {
            username: string;
        };
    } | null;
    _count: {
        other_comments: number;
    };
};

function formatComment(row: CommentRow) {
    return {
        id: row.id,
        content: row.content,
        created_at: row.created_at,
        parent_comment_id: row.parent_comment_id,

        author: {
            username: row.users.username,
        },

        parent_author_username:
            row.comments?.users.username ?? null,

        replies_count: row._count.other_comments,
    };
}

const getCommentsSchema = z.object({
    cursorId: z.string().uuid().optional(),
    parentCommentId: z.string().uuid().optional(),
});

const createCommentSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Komentarz nie może być pusty.")
        .max(2000, "Komentarz nie może przekraczać 2000 znaków."),

    parentCommentId: z
        .string()
        .uuid()
        .nullable()
        .optional()
        .default(null),
});


export async function GET(req: NextRequest, { params }: RouteContext) {
    if (!await can("posts:read")) {
        return NextResponse.json(
            {
                error: "Nie masz uprawnień do wyświetlania postów.",
            },
            { status: 403 },
        );
    }

    const { short_id } = await params;

    const query = getCommentsSchema.safeParse({
        cursorId:
            req.nextUrl.searchParams.get("cursorId") ?? undefined,

        parentCommentId:
            req.nextUrl.searchParams.get("parentCommentId") ?? undefined,
    });

    if (!query.success) {
        return NextResponse.json(
            {
                error: "Nieprawidłowe parametry zapytania.",
            },
            { status: 400 },
        );
    }

    const { cursorId, parentCommentId } = query.data;

    const post = await prisma.posts.findUnique({
        where: {
            short_id,
        },
        select: {
            id: true,
        },
    });

    if (!post) {
        return NextResponse.json(
            {
                error: "Post nie istnieje.",
            },
            { status: 404 },
        );
    }

    if (parentCommentId) {

        const parent = await prisma.comments.findFirst({
            where: {
                id: parentCommentId,
                post_id: post.id,
            },
        });

        if (parent === null) {
            return NextResponse.json(
                {
                    error: "Komentarz nadrzędny nie istnieje.",
                },
                { status: 404 },
            );
        }
    }

    let cursor: CursorRow | null = null;

    if (cursorId) {
        cursor = await prisma.comments.findFirst({
            where: {
                id: cursorId,
                post_id: post.id,
                parent_comment_id: parentCommentId ?? null,
            },
            select: {
                id: true,
                created_at: true,
            },
        });

        if (cursor === null) {
            return NextResponse.json(
                {
                    error: "Nieprawidłowy kursor.",
                },
                { status: 400 },
            );
        }
    }

    const rows = await prisma.comments.findMany({
        where: {
            post_id: post.id,
            parent_comment_id: parentCommentId ?? null,
        },

        orderBy: [
            { created_at: "asc", },
            { id: "asc", },
        ],

        cursor: cursor ? { id: cursor.id, } : undefined,
        skip: cursor ? 1 : undefined,
        take: PAGE_SIZE + 1,

        select: {
            id: true,
            content: true,
            created_at: true,
            parent_comment_id: true,

            users: {
                select: {
                    username: true,
                },
            },

            comments: {
                select: {
                    users: {
                        select: {
                            username: true,
                        },
                    },
                },
            },

            _count: {
                select: {
                    other_comments: true,
                },
            },
        },
    });


    const hasNextPage = rows.length > PAGE_SIZE;

    const pageRows = rows.slice(0, PAGE_SIZE);

    const comments = pageRows.map(formatComment);

    const nextCursor = hasNextPage
        ? pageRows[pageRows.length - 1].id
        : null;

    return NextResponse.json(
        {
            comments,
            nextCursor,
        },
        { status: 200 },
    );

}


export async function POST(req: NextRequest, { params }: RouteContext,) {
    if (!await can("posts:create")) {
        return NextResponse.json(
            {
                error: "Musisz byc zalogowany by móc publikować.",
            },
            { status: 403 },
        );
    }

    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            {
                error: "To nie powinno się zdarzyć",
            },
            { status: 500 },
        );
    }

    const { short_id } = await params;


    const parsed = createCommentSchema.safeParse(await req.json());

    if (!parsed.success) {
        return NextResponse.json(
            {
                error: parsed.error.issues
                    .map((issue) => issue.message)
                    .join(", "),
            },
            { status: 400 },
        );
    }

    const { content, parentCommentId } = parsed.data;

    const post = await prisma.posts.findUnique({
        where: {
            short_id,
        },
        select: {
            id: true,
        },
    });

    if (!post) {
        return NextResponse.json(
            {
                error: "Post nie istnieje.",
            },
            { status: 404 },
        );
    }

    if (parentCommentId) {
        const parent = await prisma.comments.findFirst({
            where: {
                id: parentCommentId,
                post_id: post.id,
            },
        });

        if (parent === null) {
            return NextResponse.json(
                {
                    error: "Komentarz, na który odpowiadasz, nie istnieje.",
                },
                { status: 404 },
            );
        }
    }

    const createdRow = await prisma.comments.create({
        data: {
            author_id: user.id,
            post_id: post.id,
            parent_comment_id: parentCommentId ?? null,
            content,
        },
        select: {
            id: true,
            content: true,
            created_at: true,
            parent_comment_id: true,
            _count: {
                select: {
                    other_comments: true,
                },
            },

            users: {
                select: {
                    username: true,
                },
            },

            comments: {
                select: {
                    users: {
                        select: {
                            username: true,
                        },
                    },
                },
            },

        },
    });


    // const createdRows = await prisma.$queryRaw<CommentRow[]>`
    //   WITH inserted AS (
    //     INSERT INTO public.comments (
    //       author_id,
    //       post_id,
    //       parent_comment_id,
    //       content
    //     )
    //     VALUES (
    //       ${user.id}::uuid,
    //       ${post.id}::uuid,
    //       ${parentCommentId}::uuid,
    //       ${content}
    //     )
    //     RETURNING
    //       id,
    //       content,
    //       created_at,
    //       parent_comment_id,
    //       author_id
    //   )

    //   SELECT
    //     c.id::text AS id,
    //     c.content,
    //     c.created_at,
    //     c.parent_comment_id::text AS parent_comment_id,

    //     parent_author.username AS parent_author_username,

    //     (
    //       SELECT COUNT(*)::int
    //       FROM public.comments AS replies
    //       WHERE replies.parent_comment_id = c.id
    //     ) AS replies_count,

    //     author.id::text AS author_id,
    //     author.username AS author_username

    //   FROM inserted AS c

    //   INNER JOIN public.users AS author
    //     ON author.id = c.author_id

    //   LEFT JOIN public.comments AS parent
    //     ON parent.id = c.parent_comment_id

    //   LEFT JOIN public.users AS parent_author
    //     ON parent_author.id = parent.author_id
    // `;

    if (createdRow === null) {
        throw new Error("Nie udało się pobrać utworzonego komentarza.");
    }

    return NextResponse.json(
        createdRow,
        { status: 201 },
    );
}
