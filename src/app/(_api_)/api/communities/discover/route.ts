import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export async function GET(req: NextRequest) {
  if (!await can("posts:discover")) {
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

  const query = req.nextUrl.searchParams.get("limit") ?? "5";
  const limit = parseInt(query);

  if (isNaN(limit) || limit < 1 || limit > 100) {
    return NextResponse.json(
      {
        error: {
          code: "BAD_REQUEST",
          message: "Parametr limit musi być liczbą całkowitą z zakresu 1-100.",
        },
      },
      { status: 400 },
    );
  }

  const currentUser = await getCurrentUser();

  const communities = currentUser
    ? await prisma.$queryRaw<{ name: string }[]>`
          SELECT c.name
          FROM communities c
          WHERE NOT EXISTS (
            SELECT 1
            FROM community_memberships cm
            WHERE cm.community_id = c.id
              AND cm.user_id = ${currentUser.id}::uuid
          )
          ORDER BY RANDOM()
          LIMIT ${limit}
        `
    : await prisma.$queryRaw<{ name: string }[]>`
          SELECT name
          FROM communities
          ORDER BY RANDOM()
          LIMIT ${limit}
        `;

  return NextResponse.json(
    {
      communities: communities.map((community) => community.name),
    },
    { status: 200 },
  );
}
