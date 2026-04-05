"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { logger } from "@/libs/logger";
import { asError, useAuthRequest, useLoginMutation } from "@/shared";

/**
 * Login form validation schema
 */
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean(),
});

/**
 * Login form data type
 */
export type LoginFormData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const { isLoginOpen, onLoginOpenChange, onOpenSignup } = useAuthRequest();

  const loginMutation = useLoginMutation();

  const methods = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await loginMutation.mutateAsync({
        email: values.email,
        password: values.password,
      });
      methods.reset();
      onLoginOpenChange(false);
    } catch (error) {
      logger.error(asError(error).message);
    }
  });

  return {
    methods,
    onSubmit,
    open: isLoginOpen,
    setOpen: onLoginOpenChange,
    isSubmitting: methods.formState.isSubmitting,
    onNavigateToSignup: onOpenSignup,
  };
};
export type UseLoginReturn = ReturnType<typeof useLogin>;
