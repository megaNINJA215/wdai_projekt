"use client";

import { useMutation, useQueryClient } from '@tanstack/react-query';
import Input from '../Input';
import Submit from '../Submit';
import { useRouter } from 'next/navigation';
import { useAuthRefresh } from '@/lib/auth/useAuthRefresh';
import { useState } from 'react';
import {
  validateLogin,
  validatePassword,
  validateConfirmPassword,
} from "@/utils/validators";
import { cn } from '@/utils/cn';

export default function RegisterForm() {
  const queryClient = useQueryClient();
  const authRefresh = useAuthRefresh();
  const router = useRouter();

  const [error, setError] = useState<any | null>(null);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate: registerFn, isPending } = useMutation({
    mutationFn: async (formData: FormData) => {
      formData.delete("confirmPassword");
      const data = Object.fromEntries(formData.entries());

      return fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        redirect: "follow",
      });
    },
    onSuccess: async () => {
      authRefresh();
      await queryClient.invalidateQueries();
      router.refresh();
      router.push("/");
    },
    onError: (error) => {
      setError(error);
    }
  });

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateLogin(login) === "invalid" || validatePassword(password) === "invalid" || validateConfirmPassword(confirmPassword, password) === "invalid") {
      return;
    }
    const formData = new FormData(e.currentTarget);
    registerFn(formData);
  };

  return (
    <form className="w-full mx-auto flex flex-col bg-bg-secondary p-8 gap-4 relative" onSubmit={handleSubmit}>
      <Input placeholder="Nazwa użytkownika" type="text" name="login"
        value={login}
        onChange={setLogin}
        validate={validateLogin}
        required />
      <Input placeholder="Hasło" type="password" name="password"
        value={password}
        onChange={setPassword}
        validate={validatePassword}
        required />
      <Input placeholder="Potwierdź Hasło" type="password" name="confirmPassword"
        value={confirmPassword}
        onChange={setConfirmPassword}
        validate={(value) => validateConfirmPassword(value, password)}
        required />
      <Submit text="Zarejestruj się" disabled={isPending} />
      <div className={cn("absolute -bottom-20 w-full left-0 text-center text-lg font-semibold transition-colors duration-150", error ? "text-danger" : "text-transparent")}>{error?.message}</div>
    </form>
  );
};