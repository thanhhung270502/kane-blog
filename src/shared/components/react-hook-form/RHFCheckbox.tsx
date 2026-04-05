"use client";

import React from "react";
import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import type { CheckboxProps } from "../checkbox";
import { Checkbox } from "../checkbox";

export interface RHFCheckboxProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<CheckboxProps, "name" | "checked" | "onCheckedChange" | "onChange"> {
  /**
   * Name of the form field
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Custom onCheckedChange handler (optional)
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Native onChange handler (optional)
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

export const RHFCheckbox = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  onCheckedChange,
  onChange,
  ...checkboxProps
}: RHFCheckboxProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Checkbox
          {...checkboxProps}
          checked={field.value}
          onCheckedChange={(checked) => {
            field.onChange(checked);
            onCheckedChange?.(checked);
          }}
          onChange={(event) => {
            field.onChange(event.target.checked);
            onChange?.(event);
          }}
        />
      )}
    />
  );
};

RHFCheckbox.displayName = "RHFCheckbox";
