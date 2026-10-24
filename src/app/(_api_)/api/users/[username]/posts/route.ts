import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";

export async function GET(req: NextRequest, { params }: { params: Promise<{ username: string }> }) {
  const PAGE_SIZE = 30;
  const { username } = await params;

  const user_id = await prisma.users.findUnique({
    where: {
      username
    },
    select: {
      id: true,
    },
  });

  if (!user_id) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Użytkownik o podanej nazwie nie istnieje.",
        },
      },
      { status: 404 },
    );
  }

  if (!await can("users:posts:get")) {
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
      author_id: user_id.id,
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