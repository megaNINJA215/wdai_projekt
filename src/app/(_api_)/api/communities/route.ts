import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

const createSchema = z.object({
  communityName: z.string().min(3, "Nazwa społeczności musi być dłuższa niż 3 znaki").max(20, "Nazwa społeczności nie może być dłuższa niż 20 znaków"),
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

  const community = await prisma.communities.create({
    data: {
      name: data.data.communityName,
      owner_id: currentUser.id,
    },
  });

  await prisma.community_memberships.create({
    data: {
      user_id: currentUser.id,
      community_id: community.id,
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

export async function GET(req: NextRequest) {
  const PAGE_SIZE = 30;

  if (!await can("communities:personalized")) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie jesteś zalogowany.",
        },
      },
      { status: 401 },
    );
  }

  const user = await getCurrentUser();


  if (!user) {
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

  const searchParams = req.nextUrl.searchParams;
  const cursorId = searchParams.get("cursorId");

  const rows = await prisma.communities.findMany({
    where: {
      community_memberships: {
        some: {
          user_id: user.id,
        },
      },
    },

    orderBy: [
      { created_at: "desc" },
      { name: "desc" },
    ],

    cursor: cursorId ? { name: cursorId } : undefined,

    skip: cursorId ? 1 : undefined,

    take: PAGE_SIZE + 1,

    select: {
      name: true,
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextCursor = hasMore
    ? pageRows[pageRows.length - 1]!.name
    : null;

  return NextResponse.json(
    {
      communities: pageRows.map((community) => community.name),
      nextCursor,
    },
    { status: 200 },
  );
}