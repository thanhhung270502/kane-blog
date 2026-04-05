"use client";

import { Typography } from "@/shared";

import { LoginForm } from "../components";
import { useLogin } from "../hooks";

export const LoginPage = () => {
  const loginMethods = useLogin();

  return (
    <div className="bg-brand-secondary flex h-screen flex-col items-center justify-center">
      <div className="border-secondary mx-auto w-full max-w-lg rounded-3xl border bg-white">
        <div className="pt-6xl px-4xl flex flex-col">
          <Typography variant="heading-md" className="font-heading text-brand-secondary">
            Welcome Back!
          </Typography>
          <Typography variant="body-md" className="text-brand-secondary-hover">
            Sign in to your account to continue
          </Typography>
        </div>
        <LoginForm {...loginMethods} />
      </div>
    </div>
  );
};
