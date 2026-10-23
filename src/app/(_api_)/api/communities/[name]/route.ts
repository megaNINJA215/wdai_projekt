import { NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  if (!await can("communities:about")) {
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


  const { name: communityName } = await params;

  const community = await prisma.communities.findUnique({
    where: {
      name: communityName,
    },
    select: {
      name: true,
      created_at: true,
      description: true,
      owner_name: true,
    },
  });

  if (!community) {
    return NextResponse.json(
      {
        error: {
          code: "COMMUNITY_NOT_FOUND",
          message: "Społeczność o podanej nazwie nie istnieje.",
        },
      },
      { status: 404 },
    );
  }

  return NextResponse.json(
    {
      data: community,
    },
    { status: 200 },
  );
}
