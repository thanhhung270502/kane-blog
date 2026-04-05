"use client";

import { Typography } from "@/shared";

import { LoginForm } from "../components";
import { useLogin } from "../hooks";

export const LoginPage = () => {
  const loginMethods = useLogin();

  return (
    <div className="bg-secondary flex h-screen flex-col items-center justify-center">
      <div className="border-secondary mx-auto w-full max-w-md rounded-3xl border bg-white">
        <div className="border-secondary flex items-center justify-center border-b p-[24px]">
          <Typography variant="heading-md" className="text-center">
            Welcome back to KaneWuyn
          </Typography>
        </div>
        <LoginForm {...loginMethods} />
      </div>
    </div>
  );
};
