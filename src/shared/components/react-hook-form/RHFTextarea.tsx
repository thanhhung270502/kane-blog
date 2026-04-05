"use client";

import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { TextareaProps } from "@/shared";
import { Textarea } from "@/shared";

export interface RHFTextareaProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<TextareaProps, "name" | "error" | "value" | "onChange" | "onBlur"> {
  /**
   * Name of the form field. Must match a field in your form schema.
   * @example "message" | "description" | "comments"
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object obtained from useForm()
   */
  control: Control<TFieldValues>;

  /**
   * Whether to display validation errors below the textarea
   * @default true
   */
  showError?: boolean;
}

/**
 * React Hook Form Textarea Component
 *
 * A wrapper around the base Textarea component that integrates with React Hook Form.
 * Provides automatic validation error display and type safety.
 *
 * @example
 * // Basic textarea
 * <RHFTextarea
 *   name="message"
 *   control={control}
 *   label="Message"
 *   placeholder="Enter your message"
 * />
 *
 * @example
 * // With custom rows
 * <RHFTextarea
 *   name="description"
 *   control={control}
 *   label="Description"
 *   rows={8}
 * />
 */
export const RHFTextarea = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  ...textareaProps
}: RHFTextareaProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        return (
          <Textarea
            {...textareaProps}
            name={field.name}
            value={field.value ?? ""}
            ref={field.ref}
            onChange={field.onChange}
            onBlur={field.onBlur}
            error={showError && fieldState.error ? fieldState.error.message : undefined}
          />
        );
      }}
    />
  );
};

RHFTextarea.displayName = "RHFTextarea";
