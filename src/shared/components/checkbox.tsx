"use client";

import type { RefObject } from "react";
import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const checkboxVariants = cva(
  [
    "relative inline-flex items-center justify-center",
    "border border-solid transition-all duration-200",
    "cursor-pointer select-none",
    "focus-visible:outline-none",
    // Checkmark (after pseudo-element)
    "after:absolute after:left-1/2 after:top-1/2 after:w-[65%] after:h-[35%]",
    "after:border-l-2 after:border-b-2 after:border-white",
    "after:scale-0 after:opacity-0 after:pointer-events-none",
    "after:transition-all after:duration-[180ms] after:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "after:transform after:-translate-x-1/2 after:-translate-y-[65%] after:rotate-[-55deg]",
    "after:content-['']",
    // Minus icon (before pseudo-element for indeterminate state)
    "before:absolute before:left-1/2 before:top-1/2 before:w-[65%] before:h-[2px]",
    "before:bg-white before:scale-0 before:opacity-0 before:pointer-events-none",
    "before:transition-all before:duration-[180ms] before:ease-[cubic-bezier(0.4,0,0.2,1)]",
    "before:transform before:-translate-x-1/2 before:-translate-y-1/2",
    "before:content-['']",
  ],
  {
    variants: {
      size: {
        sm: ["w-4 h-4 rounded-xs shrink-0"],
        md: ["w-5 h-5 rounded-xs shrink-0"],
      },
      state: {
        default: ["bg-white border-primary", "hover:bg-secondary hover:border-secondary"],
        checked: ["bg-brand-secondary border-brand-secondary", "after:scale-100 after:opacity-100"],
        indeterminate: [
          "bg-brand-secondary border-brand-secondary",
          "before:scale-100 before:opacity-100",
        ],
      },
      disabled: {
        true: [
          "cursor-not-allowed pointer-events-none",
          "after:border-disabled",
          "before:bg-disabled",
        ],
        false: "",
      },
      focused: {
        true: ["focus-visible:focus-ring-shadow-xs"],
        false: "",
      },
    },
    compoundVariants: [
      // Disabled states
      {
        disabled: true,
        state: "default",
        class: ["bg-secondary border-secondary", "hover:bg-secondary hover:border-secondary"],
      },
      {
        disabled: true,
        state: "checked",
        class: ["bg-secondary border-secondary", "hover:bg-secondary hover:border-secondary"],
      },
      {
        disabled: true,
        state: "indeterminate",
        class: ["bg-secondary border-secondary", "hover:bg-secondary hover:border-secondary"],
      },
    ],
    defaultVariants: {
      size: "md",
      state: "default",
      disabled: false,
      focused: false,
    },
  }
);

// Hidden input variants
const inputVariants = cva(
  ["absolute opacity-0 w-full h-full cursor-pointer", "focus:outline-none"],
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed pointer-events-none",
        false: "",
      },
    },
  }
);

// Label variants
const labelVariants = cva(
  ["body-sm font-regular text-black cursor-pointer select-none", "transition-colors duration-200"],
  {
    variants: {
      disabled: {
        true: "text-placeholder-subtle cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  }
);

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size" | "onChange">,
    Omit<VariantProps<typeof checkboxVariants>, "state" | "disabled" | "focused"> {
  /**
   * The size of the checkbox
   * @default "md"
   */
  size?: "sm" | "md";

  /**
   * Whether the checkbox is checked
   */
  checked?: boolean;

  /**
   * Whether the checkbox is in indeterminate state
   */
  indeterminate?: boolean;

  /**
   * Label content for the checkbox (supports ReactNode)
   */
  label?: React.ReactNode;

  /**
   * Callback fired when the checkbox state changes
   */
  onCheckedChange?: (checked: boolean) => void;

  /**
   * Native onChange event handler
   */
  onChange?: React.ChangeEventHandler<HTMLInputElement>;

  /**
   * Additional props to pass to the container of the checkbox
   */
  containerClassName?: string;

  /**
   * Ref for the input element
   */
  ref?: React.Ref<HTMLInputElement>;

  /**
   * ID for the input element (auto-generated if not provided)
   */
  id?: string;

  /**
   * Additional class names for the label
   */
  labelClassName?: string;
}

export const Checkbox = ({
  className,
  size = "md",
  checked = false,
  indeterminate = false,
  label,
  disabled = false,
  onCheckedChange,
  onChange,
  ref,
  containerClassName,
  id: providedId,
  labelClassName,
  ...props
}: CheckboxProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const id = providedId || generatedId;

  const state = indeterminate ? "indeterminate" : checked ? "checked" : "default";

  useEffect(() => {
    if (ref && inputRef.current) {
      if (typeof ref === "function") {
        ref(inputRef.current);
      } else if (ref) {
        (ref as RefObject<HTMLInputElement>).current = inputRef.current;
      }
    }
  }, [ref]);

  // Set indeterminate property on the input element
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;

    const newChecked = event.target.checked;
    onCheckedChange?.(newChecked);
    onChange?.(event);
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(event);
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    props.onBlur?.(event);
  };

  return (
    <div className={cn("inline-flex items-center gap-2", containerClassName)}>
      <div className={cn(checkboxVariants({ size, state, disabled, focused }), className)}>
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(inputVariants({ disabled }))}
          {...props}
        />
      </div>

      {/* Label */}
      {label && (
        <label htmlFor={id} className={cn(labelVariants({ disabled }), labelClassName)}>
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.displayName = "Checkbox";

export { checkboxVariants };
export type { CheckboxProps as CheckboxVariantProps };
