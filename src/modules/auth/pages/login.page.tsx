"use client";

import { Typography } from "@/shared";

import { LoginForm } from "../components";
import { useLogin } from "../hooks";

export const LoginPage = () => {
  const loginMethods = useLogin();

  return (
    <div className="bg-black-primary flex h-screen flex-col items-center justify-center">
      <div className="bg-black-secondary mx-auto w-full max-w-lg rounded-3xl">
        <div className="pt-6xl px-4xl flex flex-col">
          <Typography variant="heading-md" className="font-heading" color="primary">
            Welcome Back!
          </Typography>
          <Typography variant="body-md" color="secondary">
            Sign in to your account to continue
          </Typography>
        </div>
        <LoginForm {...loginMethods} />
      </div>
    </div>
  );
};
