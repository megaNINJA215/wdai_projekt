import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { Community } from "@/types/community";

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!(await can("search:communities"))) {
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

  const rows: Community[] = await prisma.communities.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      }
    },
    orderBy: [
      { created_at: "desc" },
      { name: "desc" },
    ],

    cursor: cursorId ? { name: cursorId } : undefined,
    skip: cursorId ? 1 : undefined,
    take: PAGE_SIZE + 1,

    select: {
      name: true,
      description: true,
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextCursor = hasMore
    ? pageRows[pageRows.length - 1]!.name
    : null;

  return NextResponse.json(
    {
      data: pageRows,
      nextCursor,
    },
    { status: 200 }
  );
}