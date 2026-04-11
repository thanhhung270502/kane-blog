"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { z } from "zod";

import { logger } from "@/libs/logger";
import { asError, useAuthRequest, useRegisterMutation } from "@/shared";

/**
 * Signup form validation schema
 */
export const signupSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  company: z.string().optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

/**
 * Signup form data type
 */
export type SignupFormData = z.infer<typeof signupSchema>;

export const useSignup = () => {
  const { isSignupOpen, onSignupOpenChange, onOpenLogin } = useAuthRequest();
  const signupMutation = useRegisterMutation();
  const router = useRouter();

  const methods = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      company: "",
      password: "",
    },
  });

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      await signupMutation.mutateAsync({
        email: values.email,
        password: values.password,
        name: values.fullName,
      });
      methods.reset();
      router.push("/");
    } catch (error) {
      logger.error(asError(error).message);
    }
  });

  return {
    methods,
    onSubmit,
    open: isSignupOpen,
    setOpen: onSignupOpenChange,
    isSubmitting: methods.formState.isSubmitting,
    onNavigateToLogin: onOpenLogin,
  };
};
export type UseSignupReturn = ReturnType<typeof useSignup>;
