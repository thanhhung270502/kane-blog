"use client";

import { type Control, Controller, type FieldValues, type Path } from "react-hook-form";

import type { MultiValue, SelectValue, SingleValue } from "@/shared";

import {
  getOptionsValue,
  onSelectChange,
  Select,
  type SelectOption,
  type SelectProps,
} from "../select";

export interface RHFSelectProps<TFieldValues extends FieldValues = FieldValues>
  extends Omit<SelectProps, "name" | "error" | "value" | "defaultValue" | "onChange"> {
  /**
   * Name of the form field
   */
  name: Path<TFieldValues>;

  /**
   * React Hook Form control object
   */
  control: Control<TFieldValues>;

  /**
   * Whether to show validation errors
   * @default true
   */
  showError?: boolean;

  /**
   * Callback when value changes
   */
  onValueChange?: (value: SelectValue | SelectValue[] | null) => void;
}

export const RHFSelect = <TFieldValues extends FieldValues = FieldValues>({
  name,
  control,
  showError = true,
  options,
  isMulti,
  onValueChange,
  ...selectProps
}: RHFSelectProps<TFieldValues>) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const { value, onChange } = field;
        const selectedValue = getOptionsValue(options || [], value);

        const handleChange = (newValue: SingleValue<SelectOption> | MultiValue<SelectOption>) => {
          let value: SelectValue | SelectValue[] | null;

          if (newValue === null || newValue === undefined) {
            value = isMulti ? [] : null;
            onChange(value);
          } else {
            onSelectChange(onChange)(newValue);
            value = Array.isArray(newValue)
              ? newValue.map((item) => item.value)
              : (newValue as SelectOption).value;
          }

          onValueChange?.(value);
        };

        return (
          <Select
            {...selectProps}
            options={options}
            isMulti={isMulti}
            value={selectedValue}
            onChange={handleChange}
            error={showError && fieldState.error ? fieldState.error.message : undefined}
          />
        );
      }}
    />
  );
};

RHFSelect.displayName = "RHFSelect";
