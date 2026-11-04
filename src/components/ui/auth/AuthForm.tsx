"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import { usePathname } from "next/navigation";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const pathname = usePathname();

  return (
    <div key={pathname}>
      {isLogin ? <LoginForm /> : <RegisterForm />}

      <div className="flex justify-center my-2 text-md font-bold">
        {isLogin ? "Nie masz jeszcze konta?" : "Masz już konto?"}
        <button
          className="text-primary hover:underline hover:cursor-pointer ml-2 hover:text-primary-hover"
          type="button"
          onClick={() => setIsLogin(prev => !prev)}
        >
          {isLogin ? "Zarejestruj się!" : "Zaloguj się!"}
        </button>
      </div>
    </div>
  );
};