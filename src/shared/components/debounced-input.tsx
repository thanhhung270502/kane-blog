"use client";

import type { ChangeEvent } from "react";
import { useEffect, useState } from "react";

import type { InputProps } from "./input";
import { Input } from "./input";

export interface DebouncedInputProps extends Omit<InputProps, "onChange"> {
  /**
   * Callback fired when the debounced value changes
   */
  onChange?: (value: string) => void;

  /**
   * Delay in milliseconds for debouncing
   * @default 300
   */
  debounceDelay?: number;

  /**
   * Default value for uncontrolled usage
   */
  defaultValue?: string;
}

const DebouncedInput = ({
  onChange,
  debounceDelay = 500,
  defaultValue = "",
  ...inputProps
}: DebouncedInputProps) => {
  const [value, setValue] = useState(defaultValue);
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
  };

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange?.(value);
    }, debounceDelay);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, debounceDelay]);

  return <Input {...inputProps} value={value} onChange={handleInputChange} />;
};

DebouncedInput.displayName = "DebouncedInput";

export { DebouncedInput };
