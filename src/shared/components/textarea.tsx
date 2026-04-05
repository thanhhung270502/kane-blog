"use client";

import React, { useId } from "react";
import { InfoIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const textareaWrapperVariants = cva(
  ["relative flex w-full border border-solid", "transition-colors"],
  {
    variants: {
      variant: {
        default: [
          "bg-white border-primary shadow-xs",
          "focus-within:border-neutral-600 focus-within:ring-1 focus-within:ring-neutral-600",
          "hover:border-primary focus-within:hover:border-neutral-600 focus-within:hover:ring-1 focus-within:hover:ring-neutral-600",
        ],
        filled: [
          "bg-white border-neutral-200 rounded-md",
          "focus-within:border-neutral-400 focus-within:ring-0",
          "hover:border-neutral-300 focus-within:hover:border-neutral-400",
        ],
        destructive: [
          "bg-white border-error shadow-xs",
          "focus-within:border-error focus-within:ring-1 focus-within:ring-error-500",
          "hover:border-error-hover focus-within:hover:border-error focus-within:hover:ring-1 focus-within:hover:ring-error-500",
        ],
      },
      disabled: {
        true: ["bg-neutral-50 border-neutral-200 cursor-not-allowed", "hover:border-neutral-200"],
        false: "",
      },
      size: {
        sm: "px-xl py-md",
        md: "px-[14px] py-md",
      },
    },
    defaultVariants: {
      variant: "default",
      disabled: false,
      size: "md",
    },
  }
);

const textareaVariants = cva(
  ["w-full bg-transparent border-0 outline-none resize-none min-h-[120px]"],
  {
    variants: {
      size: {
        sm: ["body-sm"],
        md: ["body-md"],
      },
      variant: {
        default: ["placeholder:text-quaternary", "text-primary"],
        filled: ["placeholder:text-quaternary", "text-primary"],
        destructive: ["placeholder:text-quaternary", "text-error-primary"],
      },
      disabled: {
        true: ["placeholder:text-neutral-300 text-neutral-300 cursor-not-allowed"],
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      disabled: false,
    },
  }
);

const labelVariants = cva(["body-sm font-medium"]);

const helperTextVariants = cva(["body-sm font-medium"], {
  variants: {
    variant: {
      success: "text-success",
      default: "text-tertiary",
      error: "text-error",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    Omit<VariantProps<typeof textareaVariants>, "disabled"> {
  /**
   * The variant of the textarea
   * @default "default"
   */
  variant?: "default" | "filled" | "destructive";

  /**
   * Label text for the textarea
   */
  label?: string;

  /**
   * ID for the textarea element. If not provided, will be auto-generated.
   */
  id?: string;

  /**
   * Whether the field is required
   * @default false
   */
  required?: boolean;

  /**
   * Whether to show help icon next to label
   * @default false
   */
  showHelp?: boolean;

  /**
   * Helper text below the textarea
   */
  helperText?: string;

  /**
   * Variant of the helper text
   * @default "default"
   */
  helperTextVariant?: "success" | "default" | "error";

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the textarea should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Class name for the container
   */
  containerClassName?: string;

  /**
   * Ref for the textarea element
   */
  ref?: React.Ref<HTMLTextAreaElement>;

  /**
   * Class name for the textarea wrapper
   */
  textareaWrapperClassName?: string;

  /**
   * Class name for the label wrapper
   */
  labelWrapperClassName?: string;
}

const Textarea = ({
  className,
  containerClassName,
  size = "md",
  variant = "default",
  label,
  id,
  required = false,
  showHelp = false,
  helperText,
  helperTextVariant = "default",
  error,
  disabled = false,
  fullWidth = false,
  ref,
  textareaWrapperClassName,
  labelWrapperClassName,
  ...props
}: TextareaProps) => {
  const autoId = useId();
  const textareaId = id || autoId;

  const hasError = !!error;
  const effectiveVariant = hasError ? "destructive" : variant;

  return (
    <div
      className={cn("gap-sm flex flex-col", fullWidth ? "w-full" : "w-auto", containerClassName)}
    >
      {label && (
        <div className={cn("gap-xxs flex flex-row items-center", labelWrapperClassName)}>
          <label htmlFor={textareaId} className={labelVariants()}>
            {label}
          </label>
          {required && <span className="body-md text-brand-secondary font-medium">{" *"}</span>}
          {showHelp && (
            <div className="ml-xs text-quaternary">
              <InfoIcon size={16} className="text-quaternary" />
            </div>
          )}
        </div>
      )}

      <div
        className={cn(
          textareaWrapperVariants({
            variant: effectiveVariant,
            disabled,
            size,
          }),
          textareaWrapperClassName,
          fullWidth ? "w-full" : "w-auto"
        )}
      >
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            textareaVariants({
              size,
              variant: effectiveVariant,
              disabled,
            }),
            className
          )}
          disabled={disabled}
          {...props}
        />
      </div>

      {/* Helper text or error */}
      {error && (
        <div className={cn(helperTextVariants({ variant: hasError ? "error" : "default" }))}>
          ✗ {error}
        </div>
      )}
      {helperText && (
        <div className={cn(helperTextVariants({ variant: helperTextVariant }))}>
          {helperTextVariant === "success" && "✓ "}
          {helperText}
        </div>
      )}
    </div>
  );
};

Textarea.displayName = "Textarea";

export { Textarea };
