import { NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { cookies } from 'next/headers';
import prisma from "@/lib/prisma/prisma";

export async function POST() {

  if (!await can("auth:logout")) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Nie jesteś zalogowany.",
        },
      },
      { status: 403 },
    );
  }

  const cookieStore = await cookies();
  const sessionID = cookieStore.get('session')?.value;

  if (!sessionID) {
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

  await prisma.active_sessions.delete({
    where: {
      session_id: sessionID,
    },
  });

  cookieStore.delete('session');

  return NextResponse.json(
    {
      data: {
        message: "Zostałeś pomyślnie wylogowany.",
      },
    },
    { status: 200 },
  )

}
