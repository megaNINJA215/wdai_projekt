import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";
import crypto from "crypto";
import { can } from "@/utils/permissions";
import { z } from "zod";


const loginSchema = z.object({
  login: z.string().min(3, "Nazwa użytkownika musi być dłuższa niż 3 znaki").max(100, "Nazwa użytkownika nie może być dłuższa niż 100 znaków"),
  password: z.string().min(6, "Hasło musi być dłuższe niż 6 znaków").max(100, "Hasło nie może być dłuższe niż 100 znaków"),
});

export async function POST(req: NextRequest) {


  if (!await can("auth:login")) {
    return NextResponse.json(
      {
        error: {
          code: "FORBIDDEN",
          message: "Jesteś już zalogowany.",
        },
      },
      { status: 403 },
    );
  }

  const data = loginSchema.safeParse(await req.json());
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

  data.data.login = data.data.login.normalize();
  data.data.password = data.data.password.normalize();

  const user = await prisma.users.findUnique({
    where: {
      username: data.data.login,
    },
    select: {
      id: true,
      username: true,
      password_hash: true,
      salt: true,
    },
  });

  if (!user) {
    return NextResponse.json(
      {
        error: {
          code: "USER_NOT_FOUND",
          message: "Użytkownik nie istnieje.",
        },
      },
      { status: 404 },
    );
  }

  const hashedPassword = crypto
    .scryptSync(data.data.password, user.salt, 64)
    .toString("hex");

  if (!crypto.timingSafeEqual(Buffer.from(hashedPassword, "hex"), Buffer.from(user.password_hash, "hex"))) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_PASSWORD",
          message: "Niepoprawne hasło.",
        },
      },
      { status: 401 },
    );
  }

  const sessionID = crypto.randomUUID();
  const session = await prisma.active_sessions.create({
    data: {
      session_id: sessionID,
      user_id: user.id,
    },
  });

  const response = NextResponse.json(
    {
      data: {
        message: "Zostałeś pomyślnie zalogowany.",
      },
    },
    { status: 200 },
  );

  response.cookies.set("session", session.session_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
