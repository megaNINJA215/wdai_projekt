import { NextResponse, NextRequest } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";

export async function GET(req: NextRequest) {

  if (!await can("search:autocomplete")) {
    return NextResponse.json(
      {
        error: {
          code: "INteRNAL_SERVER_ERROR",
          message: "To nie powinno się zdarzyć.",
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

  const communitiesResult = await prisma.communities.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      name: true,
      description: true,
    },
    take: 5
  });

  const communities = communitiesResult.map((community) => ({
    ...community,
    description: community.description?.slice(0, 50) ?? null,
  }));

  const users = await prisma.users.findMany({
    where: {
      username: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      username: true,
    },
    take: 5
  });


  return NextResponse.json({
    data: {
      communities,
      users,
    },
  },
    { status: 200 });

}