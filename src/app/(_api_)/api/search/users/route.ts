import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { User } from "@/types/user";

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!(await can("search:users"))) {
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

  const rows: User[] = await prisma.users.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      }
    },
    orderBy: [
      { created_at: "desc" },
      { username: "desc" },
    ],

    cursor: cursorId ? { username: cursorId } : undefined,
    skip: cursorId ? 1 : undefined,
    take: PAGE_SIZE + 1,

    select: {
      username: true,
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextCursor = hasMore
    ? pageRows[pageRows.length - 1]!.username
    : null;

  return NextResponse.json(
    {
      data: pageRows,
      nextCursor,
    },
    { status: 200 }
  );
}