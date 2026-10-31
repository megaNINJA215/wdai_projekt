import { getCurrentUser } from "@/lib/auth/currentUser";
import prisma from "@/lib/prisma/prisma";
import { can } from "@/utils/permissions";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ short_id: string }> }) {
  const { short_id } = await params;

  if (!await can("posts:saved")) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie możesz zapisać posta, jeśli nie jesteś zalogowany.",
        },
      },
      { status: 401 },
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

  const post = await prisma.posts.findUnique({
    where: {
      short_id: short_id,
    },
    select: {
      id: true,
    },
  });

  if (!post) {
    return NextResponse.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: "Post nie istnieje.",
        },
      },
      { status: 400 },
    );
  }

  const data: { saved: boolean } = await req.json();

  if (typeof data.saved !== "boolean") {
    return NextResponse.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: "Nieprawidłowy format danych.",
        },
      },
      { status: 400 },
    );
  }


  if (data.saved) {
    await prisma.saved_posts.create({
      data: {
        post_id: post.id,
        user_id: user.id,
      },
    });
  } else {
    await prisma.saved_posts.deleteMany({
      where: {
        user_id: user.id,
        post_id: post.id,
      },
    });
  }

  console.log(data.saved ? `Post ${short_id} saved` : `Post ${short_id} unsaved`);

  return NextResponse.json(
    {
      message: data.saved ? "Post został zapisany." : "Post został usunięty z zapisanych.",
    },
    { status: 200 },
  );
}

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!await can("posts:saved")) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie możesz zapisać posta, jeśli nie jesteś zalogowany.",
        },
      },
      { status: 401 },
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
      saved_posts: {
        some: {
          user_id: user.id,
        },
      },
    },

    orderBy: [
      { created_at: "desc" },
      { short_id: "desc" },
    ],

    cursor: cursorId ? { short_id: cursorId } : undefined,

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