import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ username: string }> }) {

  if (!await can("users:getInfo")) {
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

  const { username } = await params;

  const user = await prisma.users.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      created_at: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: {
          code: "NOT_FOUND",
          message: "Brak użytkownika w bazie danych.",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      isLoggedIn: true,
      data: {
        username: user.username,
        created_at: user.created_at.toLocaleString(),
      },
    },
    { status: 200 },
  )

}
