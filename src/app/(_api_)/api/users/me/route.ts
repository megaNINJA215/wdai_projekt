import { NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export async function GET() {
  if (!await can("users:me")) {
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

  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json(
      {
        isLoggedIn: false,
        data: {},
      },
      { status: 200 },
    );
  }

  const user = await prisma.users.findUnique({
    where: {
      id: currentUser?.id,
    },
    select: {
      id: true,
      username: true,
      created_at: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Błąd bazy danych",
        },
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      isLoggedIn: true,
      data: {
        username: user.username,
        created_at: user.created_at.toLocaleString(),
        user_id: user.id,
      },
    },
    { status: 200 },
  )
}
