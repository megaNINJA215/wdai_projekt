import { NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import prisma from "@/lib/prisma/prisma";
import { getCurrentUser } from "@/lib/auth/currentUser";

export async function POST(_req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name: communityName } = await params;

  if (!await can("communities:membership:join", { communityName })) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie możesz dołączyć do tej społeczności będąc niezalogowanym.",
        },
      },
      { status: 401 },
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
      { status: 401 },
    );
  }

  const community = await prisma.communities.findUnique({
    where: {
      name: communityName,
    },
    select: {
      id: true,
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

  const membership = await prisma.community_memberships.findUnique({
    where: {
      user_id_community_id: {
        user_id: currentUser.id,
        community_id: community.id,
      },
    },
  });

  if (!!membership) {
    return NextResponse.json(
      {
        error: {
          code: "MEMBERSHIP_ALREADY_EXISTS",
          message: "Jesteś już członkiem tej społeczności.",
        },
      },
      { status: 409 },
    );
  }

  await prisma.community_memberships.create({
    data: {
      user_id: currentUser.id,
      community_id: community.id,
    },
  });
  return NextResponse.json(
    {
      message: "Dołączyłeś do społeczności.",
    },
    { status: 200 },
  );
}


export async function DELETE(req: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name: communityName } = await params;

  if (!await can("communities:membership:quit", { communityName })) {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Nie możesz opuścić tej społeczności będąc niezalogowanym.",
        },
      },
      { status: 401 },
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
      { status: 401 },
    );
  }

  await prisma.community_memberships.deleteMany({
    where: {
      user_id: currentUser.id,
      communities: {
        name: communityName,
      },
    },
  });

  return NextResponse.json(
    {
      message: "Opuściłeś społeczność.",
    },
    { status: 200 },
  );
}


export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const PAGE_SIZE = 30;

  const { name: communityName } = await params;

  if (!(await can("communities:membership:get", { communityName }))) {
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message:
            "To nie powinno się zdarzyć.",
        },
      },
      { status: 500 },
    );
  }

  const searchParams = new URL(request.url).searchParams;
  const rawPage = searchParams.get("page");
  const page = rawPage === null ? 0 : Number(rawPage);

  if (!Number.isSafeInteger(page) || page < 0) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PAGE",
          message: "Numer strony musi być nieujemną liczbą całkowitą.",
        },
      },
      { status: 400 },
    );
  }

  const rows = await prisma.community_memberships.findMany({
    where: {
      communities: {
        name: communityName,
      },
    },
    orderBy: {
      users: {
        username: "asc",
      },
    },
    skip: page * PAGE_SIZE,
    take: PAGE_SIZE + 1,
    select: {
      users: {
        select: {
          username: true,
        },
      },
    },
  });

  const hasMore = rows.length > PAGE_SIZE;

  const pageRows = hasMore
    ? rows.slice(0, PAGE_SIZE)
    : rows;

  const nextPage = hasMore
    ? page + 1
    : null;

  return NextResponse.json(
    {
      users: pageRows.map((row) => row.users.username),
      nextPage,
    },
    { status: 200 }
  );
}