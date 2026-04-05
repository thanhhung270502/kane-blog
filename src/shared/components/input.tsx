"use client";

import React, { useId, useRef } from "react";
import { type Icon, InfoIcon, XIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const renderIcon = (IconComponent: Icon, onClick?: () => void) => {
  return <IconComponent size={20} onClick={onClick} className={onClick ? "cursor-pointer" : ""} />;
};

const inputWrapperVariants = cva(
  ["relative flex items-center gap-md w-full border border-solid", "transition-colors"],
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
      hasLeadingText: {
        true: [
          "flex flex-row justify-start p-0 !gap-0",
          "focus-within:border-primary focus-within:ring-0",
          "hover:border-primary",
        ],
        false: "",
      },
      hasTrailingText: {
        true: ["!py-0 !pr-0 !gap-0"],
        false: "",
      },
      size: {
        sm: "px-xl py-md",
        md: "px-[14px] py-md",
      },
      helperTextVariant: {
        success: "border-success hover:border-success-hover",
        default: "",
        error: "",
      },
    },
    compoundVariants: [
      {
        disabled: true,
        variant: ["default", "filled", "destructive"],
        class: ["bg-neutral-50 border-neutral-200 cursor-not-allowed", "hover:border-neutral-200"],
      },
      {
        hasLeadingText: true,
        variant: "destructive",
        class:
          "focus-within:hover:ring-0 border-error hover:border-error focus-within:hover:border-error",
      },
      {
        hasLeadingText: true,
        variant: "default",
        class:
          "focus-within:hover:ring-0 border-primary hover:border-primary focus-within:hover:border-primary",
      },
      {
        hasLeadingText: true,
        size: ["sm", "md"],
        class: "!p-0",
      },
      {
        variant: "filled",
        size: "md",
        class: "py-md pr-md pl-[14px]",
      },
    ],
    defaultVariants: {
      variant: "default",
      disabled: false,
      hasLeadingText: false,
      size: "md",
    },
  }
);

const addOnTextVariants = cva(
  [
    "box-border content-stretch flex flex-row items-center justify-start min-h-full max-w-15",
    "relative shrink-0",
  ],
  {
    variants: {
      variant: {
        default: "text-tertiary",
        filled: "text-tertiary",
        destructive: "text-tertiary",
      },
      size: {
        sm: "px-lg py-md body-md",
        md: "px-[14px] py-lg body-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const textInputAreaVariants = cva(
  [
    "basis-0 bg-white grow min-h-px min-w-px relative",
    "self-stretch shrink-0 rounded-r border-l focus-within:border-l-0",
  ],
  {
    variants: {
      variant: {
        default: [
          "border-primary",
          "focus-within:border-primary focus-within:ring-2 focus-within:ring-neutral-600",
        ],
        filled: ["border-neutral-200", "focus-within:border-neutral-400 focus-within:ring-0"],
        destructive: [
          "border-error-300",
          "focus-within:border-error focus-within:ring-2 focus-within:ring-error-500",
        ],
      },
      size: {
        sm: "px-xl py-md",
        md: "px-xl py-lg",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const inputVariants = cva(["w-full bg-transparent border-0 outline-none"], {
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
    hasLeadingElement: {
      true: "",
      false: "",
    },
    hasTrailingElement: {
      true: "",
      false: "",
    },
    hasLeadingText: {
      true: ["h-full"],
      false: "",
    },
  },
  compoundVariants: [
    {
      size: "sm",
      hasLeadingElement: true,
      hasLeadingText: false,
      class: "pl-0",
    },
    {
      size: "md",
      hasLeadingElement: true,
      hasLeadingText: false,
      class: "pl-0",
    },
    {
      size: "sm",
      hasTrailingElement: true,
      class: "pr-0",
    },
    {
      size: "md",
      hasTrailingElement: true,
      class: "pr-0",
    },
    {
      size: "sm",
      hasLeadingText: true,
      class: "",
    },
    {
      size: "md",
      hasLeadingText: true,
      class: "",
    },
  ],
  defaultVariants: {
    size: "md",
    variant: "default",
    disabled: false,
    hasLeadingElement: false,
    hasTrailingElement: false,
    hasLeadingText: false,
  },
});

const elementVariants = cva(["flex items-center justify-center"], {
  variants: {
    position: {
      leading: "relative shrink-0",
      trailing: "relative shrink-0",
    },
    size: {
      sm: "size-5", // 20px
      md: "size-5", // 20px
    },
    variant: {
      default: "text-tertiary",
      filled: "text-tertiary",
      destructive: "text-error-primary",
    },
    disabled: {
      true: "text-neutral-300",
      false: "",
    },
  },
  defaultVariants: {
    position: "leading",
    size: "md",
    variant: "default",
    disabled: false,
  },
});

const labelVariants = cva(["body-sm font-medium"], {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

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

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    Omit<VariantProps<typeof inputVariants>, "disabled"> {
  /**
   * The variant of the input
   * @default "default"
   */
  variant?: "default" | "filled" | "destructive";

  /**
   * Label text for the input
   */
  label?: string;

  /**
   * ID for the input element. If not provided, will be auto-generated.
   */
  id?: string;

  /**
   *
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
   * Helper text below the input
   */
  helperText?: string;

  /**
   * Variant of the helper text
   * @default "default"
   */
  helperTextVariant?: "success" | "default" | "error";

  /**
   * Leading icon component
   */
  leadingIcon?: Icon;

  /**
   * Trailing icon component
   */
  trailingIcon?: Icon;

  /**
   * Function to handle trailing icon click
   */
  onClickTrailingIcon?: () => void;

  /**
   * Leading text or element
   */
  leadingText?: React.ReactNode;

  /**
   * Trailing text or element
   */
  trailingText?: React.ReactNode;

  /**
   * Leading dropdown component
   */
  leadingDropdown?: React.ReactNode;

  /**
   * Trailing dropdown component
   */
  trailingDropdown?: React.ReactNode;

  /**
   * Error message to display
   */
  error?: string;

  /**
   * Whether the input should take full width
   * @default false
   */
  fullWidth?: boolean;

  /**
   * Class name for the container
   */
  containerClassName?: string;

  /**
   * Whether the input should be clearable
   * @default false
   */
  isClearable?: boolean;

  /**
   * Ref for the input element (React 19 style)
   */
  ref?: React.Ref<HTMLInputElement>;

  /**
   * Class name for the input wrapper
   */
  inputWrapperClassName?: string;

  /**
   * Class name for the label
   */
  labelWrapperClassName?: string;
}

const Input = ({
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
  leadingIcon,
  trailingIcon,
  leadingText,
  trailingText,
  leadingDropdown,
  trailingDropdown,
  error,
  disabled = false,
  fullWidth = false,
  ref,
  isClearable = false,
  onClickTrailingIcon,
  inputWrapperClassName,
  labelWrapperClassName,
  ...props
}: InputProps) => {
  const autoId = useId();
  const inputId = id || autoId;
  const inputRef = useRef<HTMLInputElement>(null);

  const hasError = !!error;
  const effectiveVariant = hasError ? "destructive" : variant;

  const hasLeadingElement = !!(leadingIcon || leadingText || leadingDropdown);
  const hasTrailingElement = !!(trailingIcon || trailingText || trailingDropdown);

  const handleClear = () => {
    if (!inputRef.current) return;
    const nativeInputSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      "value"
    )?.set;

    if (!nativeInputSetter) return;
    nativeInputSetter.call(inputRef.current, "");
    const event = new Event("input", { bubbles: true });
    inputRef.current.dispatchEvent(event);
    inputRef.current.focus();
  };

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  return (
    <div
      className={cn("gap-sm flex flex-col", fullWidth ? "w-full" : "w-auto", containerClassName)}
    >
      {label && (
        <div className={cn("gap-xxs flex flex-row items-center", labelWrapperClassName)}>
          <label htmlFor={inputId} className={cn(labelVariants({ size }))}>
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
          inputWrapperVariants({
            variant: effectiveVariant,
            disabled,
            hasLeadingText: !!leadingText || !!leadingDropdown,
            hasTrailingText: !!trailingText || !!trailingDropdown,
            size,
            helperTextVariant,
          }),
          fullWidth ? "w-full" : "w-auto",
          inputWrapperClassName
        )}
      >
        {leadingText && (
          <div className={cn(addOnTextVariants({ variant: effectiveVariant, size }))}>
            {leadingText}
          </div>
        )}

        {leadingIcon && (
          <div
            className={cn(
              elementVariants({
                position: "leading",
                size,
                variant: effectiveVariant,
                disabled,
              })
            )}
          >
            {renderIcon(leadingIcon)}
          </div>
        )}

        {leadingDropdown && (
          <div
            className={cn(
              addOnTextVariants({
                size,
                variant: effectiveVariant,
              })
            )}
          >
            {leadingDropdown}
          </div>
        )}

        {/* Input */}
        {leadingText ? (
          <div className={cn(textInputAreaVariants({ size, variant: effectiveVariant }))}>
            <input
              id={inputId}
              ref={setInputRef}
              className={cn(
                inputVariants({
                  size,
                  variant: effectiveVariant,
                  disabled,
                  hasLeadingElement: false,
                  hasTrailingElement,
                  hasLeadingText: true,
                }),
                className
              )}
              disabled={disabled}
              {...props}
            />
          </div>
        ) : (
          <input
            id={inputId}
            ref={setInputRef}
            className={cn(
              inputVariants({
                size,
                variant: effectiveVariant,
                disabled,
                hasLeadingElement,
                hasTrailingElement,
                hasLeadingText: false,
              }),
              className
            )}
            disabled={disabled}
            {...props}
          />
        )}

        {/* Trailing Elements */}
        {trailingIcon && (
          <div
            className={cn(
              elementVariants({
                position: "trailing",
                size,
                variant: effectiveVariant,
                disabled,
              })
            )}
          >
            {renderIcon(trailingIcon, onClickTrailingIcon)}
          </div>
        )}

        {trailingText && (
          <div className={cn(addOnTextVariants({ variant: effectiveVariant, size }))}>
            {trailingText}
          </div>
        )}

        {trailingDropdown && (
          <div
            className={cn(
              addOnTextVariants({
                size,
                variant: effectiveVariant,
              })
            )}
          >
            {trailingDropdown}
          </div>
        )}

        {
          // eslint-disable-next-line react-hooks/refs
          isClearable && !!inputRef.current?.value && (
            <div
              className="ml-xs cursor-pointer"
              role="button"
              aria-label="Clear input"
              aria-hidden="true"
              onClick={handleClear}
            >
              <XIcon size={16} className="text-quaternary hover:text-secondary" />
            </div>
          )
        }
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

Input.displayName = "Input";

export { Input };
