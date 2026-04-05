"use client";

import { useCallback } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";

import type { InputProps } from "@/shared";
import { Input } from "@/shared";

export interface RHFInputProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<InputProps, "name" | "error" | "value" | "onChange" | "onBlur"> {
  /**
   * Name of the form field. Must match a field in your form schema.
   * @example "firstName" | "contact.email" | "items.0.quantity"
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object obtained from useForm()
   */
  control: Control<TFieldValues>;

  /**
   * Whether to display validation errors below the input
   * @default true
   */
  showError?: boolean;

  /**
   * Optional formatter function to transform input values as user types.
   * Commonly used for phone numbers, credit cards, postal codes, etc.
   * Note: Only applies to text inputs (not type="number")
   * @param value - The current input value as a string
   * @returns The formatted string to display and store in form state
   * @example
   * // Phone number formatting
   * formatter={(v) => formatPhoneNumber(v, "US")}
   *
   * @example
   * // Uppercase transformation
   * formatter={(v) => v.toUpperCase()}
   */
  formatter?: (value: string) => string;
}

/**
 * React Hook Form Input Component
 *
 * A wrapper around the base Input component that integrates with React Hook Form.
 * Provides automatic validation error display, value formatting, and type safety.
 *
 * @example
 * // Basic text input
 * <RHFInput
 *   name="firstName"
 *   control={control}
 *   label="First Name"
 *   placeholder="Enter your first name"
 * />
 *
 * @example
 * // Phone number with formatting
 * <RHFInput
 *   name="phone"
 *   control={control}
 *   label="Phone"
 *   formatter={(v) => formatPhoneNumber(v, "US")}
 * />
 *
 * @example
 * // Number input
 * <RHFInput
 *   name="age"
 *   control={control}
 *   type="number"
 *   min={0}
 *   max={120}
 * />
 */
export const RHFInput = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  formatter,
  type,
  ...inputProps
}: RHFInputProps<TFieldValues>) => {
  // Memoize the formatting logic to prevent unnecessary re-renders
  const applyFormatter = useCallback(
    (value: string): string => {
      if (!formatter) return value;
      return formatter(value);
    },
    [formatter]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value: string | number | null = e.target.value;

          // Handle number inputs
          if (type === "number") {
            const numValue = e.target.valueAsNumber;
            value = Number.isNaN(numValue) ? null : numValue;
          }
          // Handle text formatting
          else if (formatter) {
            value = applyFormatter(value);
          }

          field.onChange(value);
        };

        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
          // Apply formatter on blur if configured
          if (formatter && type !== "number") {
            const formatted = applyFormatter(e.target.value);
            if (formatted !== e.target.value) {
              field.onChange(formatted);
            }
          }
          field.onBlur();
        };

        return (
          <Input
            {...inputProps}
            type={type}
            name={field.name}
            value={field.value ?? ""}
            ref={field.ref}
            onChange={handleChange}
            onBlur={handleBlur}
            error={showError && fieldState.error ? fieldState.error.message : undefined}
          />
        );
      }}
    />
  );
};

RHFInput.displayName = "RHFInput";
