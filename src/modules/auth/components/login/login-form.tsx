"use client";

import Link from "next/link";

import { Button, FormProvider, RHFCheckbox, RHFInput, RHFPassword, Typography } from "@/shared";

import type { UseLoginReturn } from "../../hooks";

type LoginFormProps = UseLoginReturn;

export const LoginForm = ({ methods, onSubmit, isSubmitting }: LoginFormProps) => {
  return (
    <FormProvider formMethods={methods} onSubmit={onSubmit}>
      <div className="gap-4xl flex flex-col overflow-y-auto p-[24px]">
        <div className="gap-2xl flex flex-col">
          <RHFInput
            name="email"
            control={methods.control}
            type="email"
            placeholder="Your email"
            autoComplete="email"
            label="Email"
            required
            // inputWrapperClassName="bg-black-tertiary "
            // eslint-disable-next-line jsx-a11y/no-autofocus
            autoFocus
          />
          <RHFPassword
            name="password"
            control={methods.control}
            placeholder="Your password"
            autoComplete="current-password"
            label="Password"
            required
          />
          <div className="flex items-center justify-between">
            <RHFCheckbox
              name="rememberMe"
              control={methods.control}
              label="Remember me on this device"
              labelClassName="text-white-primary"
            />
            <Link href="/forgot-password">
              <Typography variant="body-sm" color="secondary" weight="medium">
                Forgot password?
              </Typography>
            </Link>
          </div>
        </div>
        <div className="gap-4xl flex flex-col">
          <Button
            variant="black-quaternary"
            type="submit"
            loading={isSubmitting}
            fullWidth
            size="lg"
            rounded="full"
          >
            Sign in to Sweet Pix
          </Button>
          {/* Divider */}
          {/* <div className="gap-4xl flex items-center">
            <div className="bg-quaternary h-px flex-1" />
            <Typography variant="body-sm" color="primary" weight="regular">
              or
            </Typography>
            <div className="bg-quaternary h-px flex-1" />
          </div> */}
          {/* Google sign in */}
          {/* <Button
            type="button"
            variant="outlined-black-quaternary"
            fullWidth
            rounded="full"
            startIcon={<GoogleIcon />}
            className="text-white-primary py-lg"
            onClick={() => window.location.assign("/api/auth/google")}
          >
            Login with Google
          </Button> */}
          <Typography variant="body-sm" color="secondary" weight="regular" className="text-center">
            Don't have an account?{" "}
            <Link href="/signup">
              <Button variant="text-secondary">Sign up</Button>
            </Link>
          </Typography>
        </div>
      </div>
    </FormProvider>
  );
};

// const GoogleIcon = () => (
//   <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path
//       d="M18.17 8.37H17.5V8.33H10V11.67H14.71C14.02 13.61 12.18 15 10 15C7.24 15 5 12.76 5 10C5 7.24 7.24 5 10 5C11.27 5 12.42 5.48 13.3 6.27L15.66 3.91C14.15 2.5 12.18 1.67 10 1.67C5.4 1.67 1.67 5.4 1.67 10C1.67 14.6 5.4 18.33 10 18.33C14.6 18.33 18.33 14.6 18.33 10C18.33 9.44 18.28 8.9 18.17 8.37Z"
//       fill="#F44336"
//     />
//     <path
//       d="M2.63 6.12L5.37 8.13C6.11 6.29 7.9 5 10 5C11.27 5 12.42 5.48 13.3 6.27L15.66 3.91C14.15 2.5 12.18 1.67 10 1.67C6.95 1.67 4.31 3.47 2.63 6.12Z"
//       fill="#FFC107"
//     />
//     <path
//       d="M10 18.33C12.13 18.33 14.06 17.54 15.56 16.2L12.97 14.01C12.12 14.65 11.08 15 10 15C7.83 15 5.99 13.62 5.3 11.69L2.58 13.78C4.24 16.51 6.9 18.33 10 18.33Z"
//       fill="#43A047"
//     />
//     <path
//       d="M18.17 8.37H17.5V8.33H10V11.67H14.71C14.38 12.59 13.79 13.39 13 13.97L13 13.97L15.56 16.2C15.38 16.37 18.33 14.17 18.33 10C18.33 9.44 18.28 8.9 18.17 8.37Z"
//       fill="#448AFF"
//     />
//   </svg>
// );
