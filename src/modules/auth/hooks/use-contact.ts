"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";

/**
 * Contact form validation schema
 */
export const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

/**
 * Contact form data type
 */
export type ContactFormData = z.infer<typeof contactSchema>;

export const useContact = () => {
  const [open, setOpen] = useState(false);
  const methods = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = methods.handleSubmit(async () => {
    // TODO: wire to your contact API
    toast.success("Login successful");
    setOpen(false);
  });

  return {
    methods,
    onSubmit,
    isSubmitting: methods.formState.isSubmitting,
    open,
    setOpen,
  };
};

export type UseContactReturn = ReturnType<typeof useContact>;
