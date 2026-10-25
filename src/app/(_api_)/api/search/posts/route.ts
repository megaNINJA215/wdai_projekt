import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";

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

  const searchParams = new URL(req.url).searchParams;
  const rawPage = searchParams.get("page");
  const page = rawPage === null ? 0 : Number(rawPage);

  if (!Number.isSafeInteger(page) || page < 0) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAGE",
          message: "Numer strony musi być nieujemną liczbą całkowitą.",
        },
      },
      { status: 400 },
    );
  }

  const rows = await prisma.posts.findMany({
    where: {
      title: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: {
      title: "asc",
    },
    skip: page * PAGE_SIZE,
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
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextPage = hasMore
    ? page + 1
    : null;

  return NextResponse.json(
    {
      users: pageRows.map(({ users, communities, ...row }) => { return { ...row, author: users.username, community: communities?.name } }),
      nextPage,
    },
    { status: 200 }
  );
}