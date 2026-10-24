import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

const createSchema = z.object({
  communityName: z.string().min(3, "Nazwa społeczności musi być dłuższa niż 3 znaki").max(100, "Nazwa społeczności nie może być dłuższa niż 100 znaków"),
});

export async function POST(req: NextRequest) {
  if (!await can("communities:create")) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Nie możesz stworzyć społeczności będąc niezalogowanym.",
        },
      },
      { status: 403 },
    );
  }

  const data = createSchema.safeParse(await req.json());
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

  data.data.communityName = data.data.communityName.normalize();
  const communityExists = !!(
    await prisma.communities.findUnique({
      where: {
        name: data.data.communityName,
      },
    })
  );

  if (communityExists) {
    return NextResponse.json(
      {
        error: {
          code: "COMMUNITY_EXISTS",
          message: "Społeczność o podanej nazwie już istnieje.",
        },
      },
      { status: 400 },
    );
  }

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

  await prisma.communities.create({
    data: {
      name: data.data.communityName,
      owner_id: currentUser.id,
    },
  });

  return NextResponse.json(
    {
      data: {
        message: "Społeczność została utworzona pomyślnie.",
      },
    },
    { status: 201 },
  );
}
