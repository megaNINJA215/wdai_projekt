import { NextRequest, NextResponse } from "next/server";
import { can } from "@/utils/permissions";
import { z } from "zod";
import prisma from "@/lib/prisma/prisma";
import crypto from "crypto";

const registerSchema = z.object({
  login: z.string().min(3, "Nazwa użytkownika musi być dłuższa niż 3 znaki").max(100, "Nazwa użytkownika nie może być dłuższa niż 100 znaków"),
  password: z.string().min(6, "Hasło musi być dłuższe niż 6 znaków").max(100, "Hasło nie może być dłuższe niż 100 znaków"),
});

export async function POST(req: NextRequest) {

  if (!await can("auth:register")) {
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

  const data = registerSchema.safeParse(await req.json());
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

  const userExists = !!(
    await prisma.users.findUnique({
      where: {
        username: data.data.login,
      },
    })
  );

  if (userExists) {
    return NextResponse.json(
      {
        error: {
          code: "USER_EXISTS",
          message: "Użytkownik o podanym loginie już istnieje.",
        },
      },
      { status: 400 },
    );
  }

  const salt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = crypto
    .scryptSync(data.data.password, salt, 64)
    .toString("hex");

  const user = await prisma.users.create({
    data: {
      username: data.data.login,
      password_hash: hashedPassword,
      salt: salt,
    },
  });

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
        message: "Konto zostało utworzone pomyślnie.",
      },
    },
    { status: 201 },
  );

  response.cookies.set("session", session.session_id, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  return response;
}
