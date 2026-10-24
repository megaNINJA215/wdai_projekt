import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import z from "zod";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ short_id: string }> }) {
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


const editPostSchema = z.object({
  title: z.string().min(3, "Tytuł posta musi być dłuższy niż 3 znaki").max(100, "Tytuł posta nie może być dłuższy niż 100 znaków").optional(),
  content: z.string().min(1, "Treść posta nie może być pusta").max(1000, "Treść posta nie może być dłuższa niż 1000 znaków").optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ short_id: string }> }) {
  const { short_id } = await params;

  if (!await can("posts:edit", { short_id })) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie możesz edytować cudzego posta.",
        },
      },
      { status: 401 },
    );
  }

  const data = editPostSchema.safeParse(await req.json());

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


  const to_edit: { title?: string; content?: string } = {};

  if (data.data.title !== undefined) {
    to_edit.title = data.data.title;
  }

  if (data.data.content !== undefined) {
    to_edit.content = data.data.content;
  }

  if (Object.keys(to_edit).length === 0) {
    return NextResponse.json(
      {
        error: {
          code: "VALIDATION_ERROR",
          message: "Nie podano żadnych danych do edycji.",
        },
      },
      { status: 400 },
    );
  }

  const updatedPost = await prisma.posts.update({
    where: { short_id: short_id },
    data: { ...data.data, edited_at: new Date() },
  });

  return NextResponse.json(
    {
      data: updatedPost,
    },
    { status: 200 },
  );


}
