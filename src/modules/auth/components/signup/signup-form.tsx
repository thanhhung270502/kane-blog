"use client";

import Link from "next/link";

import { Button, FormProvider, RHFInput, RHFPassword, Typography } from "@/shared";

import type { UseSignupReturn } from "../../hooks";

type SignupFormProps = UseSignupReturn;

export const SignupForm = ({ methods, onSubmit, isSubmitting }: SignupFormProps) => {
  return (
    <FormProvider formMethods={methods} onSubmit={onSubmit}>
      <div className="gap-4xl p-4xl flex flex-1 flex-col justify-between overflow-y-auto">
        <div className="gap-2xl flex flex-col">
          <RHFInput
            name="fullName"
            control={methods.control}
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            label="Full name"
            required
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <RHFInput
            name="email"
            control={methods.control}
            type="email"
            placeholder="Your email"
            autoComplete="email"
            label="Email"
            required
          />
          <RHFPassword
            name="password"
            control={methods.control}
            placeholder="Your password"
            autoComplete="new-password"
            label="Password"
            required
          />
        </div>
        <div className="gap-4xl flex flex-col">
          <Button
            variant="black-quaternary"
            type="submit"
            loading={isSubmitting}
            size="lg"
            fullWidth
            rounded="full"
          >
            Sign up with email
          </Button>
          <Typography variant="body-sm" color="secondary" weight="regular" className="text-center">
            Already have an account?{" "}
            <Link href="/login">
              <Button variant="text-secondary">Sign in</Button>
            </Link>
          </Typography>
        </div>
      </div>
    </FormProvider>
  );
};
