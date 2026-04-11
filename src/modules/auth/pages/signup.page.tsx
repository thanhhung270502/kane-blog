"use client";

import { Typography } from "@/shared";

import { SignupForm } from "../components";
import { useSignup } from "../hooks";

export const SignupPage = () => {
  const signupMethods = useSignup();

  return (
    <div className="bg-black-primary flex h-screen flex-col items-center justify-center">
      <div className="bg-black-secondary mx-auto w-full max-w-lg rounded-3xl">
        <div className="pt-6xl px-4xl flex flex-col">
          <Typography variant="heading-md" className="font-heading" color="primary">
            Create your account
          </Typography>
          <Typography variant="body-md" color="secondary">
            Create your account to start your journey
          </Typography>
        </div>
        <SignupForm {...signupMethods} />
      </div>
    </div>
  );
};
