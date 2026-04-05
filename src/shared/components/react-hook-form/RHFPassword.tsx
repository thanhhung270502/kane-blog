"use client";

import { useState } from "react";
import type { Control, FieldValues, Path } from "react-hook-form";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react";

import { type InputProps, RHFInput } from "@/shared";

export interface RHFPasswordProps<TFieldValues extends FieldValues = FieldValues>
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

export const RHFPassword = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  formatter,
  ...inputProps
}: RHFPasswordProps<TFieldValues>) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <RHFInput
      name={name}
      control={control}
      showError={showError}
      formatter={formatter}
      {...inputProps}
      type={showPassword ? "text" : "password"}
      trailingIcon={showPassword ? EyeSlashIcon : EyeIcon}
      onClickTrailingIcon={() => setShowPassword(!showPassword)}
    />
  );
};
