import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!await can("posts:saved")) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie możesz pozyskać zapisanych postów będąc niezalogowanym.",
        },
      },
      { status: 400 },
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

  const rows = await prisma.saved_posts.findMany({
    where: {
      user_id: user.id,
    },

    orderBy: [
      { saved_at: "desc" },
      { post_id: "desc" },
    ],

    cursor: cursorId
      ? {
        user_id_post_id: {
          user_id: user.id,
          post_id: cursorId,
        },
      }
      : undefined,

    skip: cursorId ? 1 : undefined,
    take: PAGE_SIZE + 1,

    select: {
      saved_at: true,
      posts: {
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
      },
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextCursor = hasMore
    ? pageRows[pageRows.length - 1]!.posts.short_id
    : null;

  return NextResponse.json(
    {
      posts: pageRows.map(({ posts, ...rest }) => {
        const {
          users,
          communities,
          ...postData
        } = posts;

        return {
          ...postData,
          author: users.username,
          community: communities?.name ?? null,
        };
      }),
      nextCursor,
    },
    { status: 200 },
  );
}