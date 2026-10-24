import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";
import { shortID } from "@/utils/short_id";

const createPostSchema = z.object({
  title: z.string().min(3, "Tytuł posta musi być dłuższy niż 3 znaki").max(100, "Tytuł posta nie może być dłuższy niż 100 znaków"),
  content: z.string().min(1, "Treść posta nie może być pusta").max(1000, "Treść posta nie może być dłuższa niż 1000 znaków"),
});

export async function POST(req: NextRequest) {
  if (!await can("posts:create")) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Nie możesz stworzyć posta będąc niezalogowanym.",
        },
      },
      { status: 403 },
    );
  }

  const data = createPostSchema.safeParse(await req.json());
  if (!data.success) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: data.error.issues.map((issue) => issue.message).join(", "),
        },
      },
      { status: 400 },
    );
  }

  data.data.title = data.data.title.normalize();
  data.data.content = data.data.content.normalize();
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "To nie powinno się zdarzyć.",
        },
      },
      { status: 500 },
    );
  }

  await prisma.posts.create({
    data: {
      title: data.data.title,
      content: data.data.content,
      author_id: currentUser.id,
      community_id: null,
      short_id: shortID(),
    },
  });

  return NextResponse.json(
    {
      data: {
        message: "Post został utworzony pomyślnie.",
      },
    },
    { status: 201 },
  );
}

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!await can("posts:personalized")) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Będąc niezalogowanym, nie możesz mieć spersonalizowanych postów.",
        },
      },
      { status: 403 },
    );
  }

  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "To nie powinno się zdarzyć.",
        },
      },
      { status: 500 },
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const cursorId = searchParams.get("cursorId");

  const rows = await prisma.posts.findMany({
    where: {
      communities: {
        community_memberships: {
          some: {
            user_id: user.id,
          },
        },
      },
    },

    orderBy: [
      { created_at: "desc" },
      { short_id: "desc" },
    ],

    cursor: cursorId ? { id: cursorId } : undefined,

    skip: cursorId ? 1 : undefined,

    take: PAGE_SIZE + 1,

    select: {
      short_id: true,
      users: {
        select: {
          username: true,
        },
      },
      title: true,
      content: true,
      created_at: true,
      edited_at: true,
      communities: {
        select: {
          name: true,
        },
      },
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextCursor = hasMore
    ? pageRows[pageRows.length - 1]!.short_id
    : null;

  return NextResponse.json(
    {
      posts: pageRows.map(({ users, communities, ...rest }) => ({
        ...rest,
        author: users.username,
        community: communities?.name,
      })),
      nextCursor,
    },
    { status: 200 },
  );
}