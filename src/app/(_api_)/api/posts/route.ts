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