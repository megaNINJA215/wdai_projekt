import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { Post } from "@/types/post";

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!(await can("search:posts"))) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message:
            "To nie powinno się zdarzyć.",
        },
      },
      { status: 500 },
    );
  }

  const query = req.nextUrl.searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: "Brak parametru query.",
        },
      },
      { status: 400 },
    );
  }

  const searchParams = req.nextUrl.searchParams;
  const cursorId = searchParams.get("cursorId");

  const rows = await prisma.posts.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
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
      communities: {
        select: {
          name: true,
        },
      },
      title: true,
      content: true,
      users: {
        select: {
          username: true,
        },
      },
      short_id: true,
      created_at: true,
      edited_at: true,
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
      data: pageRows.map(({ users, communities, ...row }) => { return { ...row, author: users.username, community: communities?.name } }),
      nextCursor,
    },
    { status: 200 }
  );
}