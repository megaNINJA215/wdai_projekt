import { NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ short_id: string }> }) {
  if (!await can("posts:read")) {
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

  const { short_id } = await params;

  const post = await prisma.posts.findUnique({
    where: {
      short_id: short_id,
    },
    select: {
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
      }
    },
  });

  if (!post) {
    return NextResponse.json(
      {
        error: {
          code: "POST_NOT_FOUND",
          message: "Post nie istnieje.",
        },
      },
      { status: 404 },
    );
  }

  const { users, communities, ...rest } = post;

  const formattedPost = {
    ...rest,
    author: users.username,
    community: communities ? communities.name : null,
  };

  return NextResponse.json(
    {
      data: formattedPost,
    },
    { status: 200 },
  );
}
