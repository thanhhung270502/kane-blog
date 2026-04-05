"use client";

import { Button, FormProvider, RHFInput, RHFPassword } from "@/shared";

import type { UseSignupReturn } from "../../hooks";

type SignupFormProps = UseSignupReturn;

export const SignupForm = ({ methods, onSubmit, isSubmitting }: SignupFormProps) => {
  return (
    <FormProvider formMethods={methods} onSubmit={onSubmit}>
      <div className="gap-4xl flex flex-1 flex-col justify-between overflow-y-auto p-[56px]">
        <div className="gap-2xl flex flex-col">
          <RHFInput
            name="fullName"
            control={methods.control}
            type="text"
            placeholder="Your full name"
            autoComplete="name"
            label="Full name"
            variant="filled"
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
            variant="filled"
            required
          />
          <RHFInput
            name="company"
            control={methods.control}
            type="text"
            placeholder="Company name"
            autoComplete="organization"
            label="Company"
            variant="filled"
          />
          <RHFPassword
            name="password"
            control={methods.control}
            placeholder="Your password"
            autoComplete="new-password"
            label="Password"
            variant="filled"
            required
          />
        </div>
        <div className="gap-4xl flex flex-col">
          <Button type="submit" loading={isSubmitting} fullWidth rounded>
            Sign up with email
          </Button>
        </div>
      </div>
    </FormProvider>
  );
};
