"use server";

import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/currentUser";
import LoginHeader from "@/components/ui/auth/LoginHeader";
import AuthForm from "@/components/ui/auth/AuthForm";

export default async function Login() {
  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/");
  }

  return (
    <div className="bg-fg border-border border-4 rounded-2xl w-9/10 max-w-100 h-auto">
      <LoginHeader />
      <AuthForm />
    </div>
  );
}
