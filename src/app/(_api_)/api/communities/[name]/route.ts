import { NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { z } from "zod";

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
      users: {
        select: {
          username: true,
        },
      }
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
  const { users, ...rest } = community;

  const formattedCommunity = {
    ...rest,
    owner_name: users.username,
  };

  return NextResponse.json(
    {
      data: formattedCommunity,
    },
    { status: 200 },
  );
}

const communityPatchSchema = z.object({
  description: z.string().max(1000, "Opis nie może być dłuższy niż 1000 znaków").nullable(),
});

export async function PATCH(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name: communityName } = await params;
  const data = communityPatchSchema.safeParse(await req.json());

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

  const community = await prisma.communities.findUnique({
    where: {
      name: communityName,
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

  if (!await can("communities:edit", { communityName })) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Brak uprawnień do edycji tej społeczności.",
        },
      },
      { status: 401 },
    );
  }

  await prisma.communities.update({
    where: {
      name: communityName,
    },
    data: {
      description: data.data.description,
    },
  });

  return NextResponse.json(
    {
      data: {
        name: communityName,
        description: data.data.description,
      },
    },
    { status: 200 },
  );
}
