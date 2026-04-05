import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { isValidElement } from "react";
import type { Icon, IconWeight } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

export enum EButtonVariant {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  GRAY = "gray",
  "OUTLINED-PRIMARY" = "outlined-primary",
  "OUTLINED-SECONDARY" = "outlined-secondary",
  "OUTLINED-GRAY" = "outlined-gray",
  "TEXT-PRIMARY" = "text-primary",
  "TEXT-SECONDARY" = "text-secondary",
  "TEXT-GRAY" = "text-gray",
}

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center",
    "font-medium transition-all duration-200 cursor-pointer",
    "active:outline-none focus-visible:outline-none focus-visible:focus-ring-shadow-xs",
    "disabled:pointer-events-none disabled:cursor-not-allowed",
    "select-none whitespace-nowrap",
  ],
  {
    variants: {
      variant: {
        // Contained variants
        primary: [
          "bg-black text-white border border-black font-semibold",
          "hover:bg-brand-primary-hover hover:border-neutral-800",
          "active:bg-black active:border-black",
          "disabled:opacity-50",
        ],
        secondary: [
          "bg-brand-secondary text-white border border-brand-secondary font-semibold",
          "hover:bg-brand-secondary-hover hover:border-brand-secondary-hover hover:text-white",
          "active:bg-brand-secondary active:border-brand-secondary active:text-white",
          "disabled:opacity-50",
        ],
        gray: [
          "bg-neutral-200 text-neutral-900 border border-neutral-200 font-semibold",
          "hover:bg-neutral-500 hover:border-neutral-500 hover:text-neutral-900",
          "active:bg-neutral-200 active:border-neutral-200 active:text-neutral-900",
          "disabled:opacity-50",
        ],
        // Outlined variants
        "outlined-primary": [
          "bg-transparent text-black border border-black font-semibold",
          "hover:bg-brand-primary-hover hover:border-brand-primary-hover hover:text-white",
          "active:bg-brand-primary active:border-brand-primary active:text-white",
          "disabled:text-brand-primary-disabled disabled:border-brand-primary-disabled disabled:shadow-xs",
        ],
        "outlined-secondary": [
          "bg-transparent text-brand-secondary border border-brand-secondary font-semibold",
          "hover:bg-brand-secondary-hover hover:border-brand-secondary-hover hover:text-white",
          "active:bg-brand-secondary active:border-brand-secondary active:text-white",
          "disabled:text-brand-secondary-disabled disabled:border-brand-secondary-disabled disabled:shadow-xs",
        ],
        "outlined-gray": [
          "bg-transparent text-neutral-400 border border-neutral-200 font-semibold",
          "hover:bg-neutral-500 hover:border-neutral-500 hover:text-neutral-900",
          "active:bg-neutral-400 active:border-neutral-400 active:text-neutral-900",
          "disabled:text-neutral-400 disabled:border-neutral-400 disabled:shadow-xs",
        ],
        // Text variants
        "text-primary": [
          "bg-transparent text-black font-semibold p-0! underline",
          "hover:text-neutral-600",
          "active:bg-brand-primary active:border-brand-primary active:text-white",
          "disabled:text-brand-primary-disabled disabled:border-brand-primary-disabled disabled:shadow-xs",
        ],
        "text-secondary": [
          "bg-transparent text-brand-secondary font-semibold p-0! underline",
          "hover:text-brand-secondary-hover",
          "active:bg-brand-secondary active:border-brand-secondary active:text-white",
          "disabled:text-brand-secondary-disabled disabled:border-brand-secondary-disabled disabled:shadow-xs",
        ],
        "text-gray": [
          "bg-transparent text-neutral-400 font-semibold p-0! underline",
          "hover:text-neutral-500",
          "active:bg-neutral-400 active:border-neutral-400 active:text-neutral-900",
          "disabled:text-neutral-400 disabled:border-neutral-400 disabled:shadow-xs",
        ],
        // No Outlined variants
        "no-outlined-primary": [
          "bg-transparent text-black font-semibold",
          "hover:bg-brand-primary-hover hover:border-brand-primary-hover hover:text-white",
          "active:bg-brand-primary active:border-brand-primary active:text-white",
          "disabled:text-brand-primary-disabled disabled:border-brand-primary-disabled disabled:shadow-xs",
        ],
        "no-outlined-secondary": [
          "bg-transparent text-brand-secondary font-semibold",
          "hover:bg-brand-secondary-hover hover:border-brand-secondary-hover hover:text-white",
          "active:bg-brand-secondary active:border-brand-secondary active:text-white",
          "disabled:text-brand-secondary-disabled disabled:border-brand-secondary-disabled disabled:shadow-xs",
        ],
        "no-outlined-gray": [
          "bg-transparent text-neutral-400 font-semibold",
          "hover:bg-neutral-500 hover:border-neutral-500 hover:text-neutral-900",
          "active:bg-neutral-400 active:border-neutral-400 active:text-neutral-900",
          "disabled:text-neutral-400 disabled:border-neutral-400 disabled:shadow-xs",
        ],
      },
      size: {
        xs: ["px-lg py-xs body-md", "gap-xs"],
        sm: ["px-xl py-sm body-md", "gap-xs"],
        md: ["px-[14px] py-md body-md", "gap-sm"],
        lg: ["px-2xl py-lg body-lg", "gap-sm"],
        xl: ["px-[18px] py-xl body-lg", "gap-sm"],
      },
      iconOnly: {
        true: "!p-lg rounded-full",
        false: "",
      },
      rounded: {
        true: "rounded-full",
        false: "",
      },
      loading: {
        true: "!text-gray !cursor-not-allowed",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      iconOnly: false,
      rounded: false,
    },
  }
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /**
   * If true, only renders the icon without text
   */
  iconOnly?: boolean;
  /**
   * Icon to display at the start (left) of the button
   */
  startIcon?: Icon | ReactNode;
  /**
   * Icon to display at the end (right) of the button
   */
  endIcon?: Icon | ReactNode;
  /**
   * Loading state
   */
  loading?: boolean;
  /**
   * Loading icon/spinner
   */
  loadingIcon?: Icon;
  /**
   * Icon variant
   */
  iconWeight?: IconWeight;
  /**
   * Whether the button should be fully rounded (pill shape)
   * @default false
   */
  rounded?: boolean;
  /**
   * Whether the button should take full width
   * @default false
   */
  fullWidth?: boolean;
}

const getIconSize = (size: "xs" | "sm" | "md" | "lg" | "xl", iconOnly: boolean) => {
  if (!iconOnly) {
    return 16.67;
  }

  switch (size) {
    case "xs":
    case "sm":
    case "md":
    case "lg":
    case "xl":
    default:
      return 20;
  }
};

const renderIcon = (
  IconComponent: Icon | ReactNode,
  size: "xs" | "sm" | "md" | "lg" | "xl",
  iconWeight: IconWeight,
  iconOnly: boolean
) => {
  const iconSize = getIconSize(size, iconOnly);
  if (isValidElement(IconComponent)) {
    return IconComponent;
  }

  const Icon = IconComponent as Icon;
  return <Icon size={iconSize} weight={iconWeight} />;
};

const LoadingSpinner = ({ size = "sm" }: { size?: "xs" | "sm" | "md" | "lg" | "xl" }) => {
  const sizeClasses = {
    xs: "w-3 h-3",
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
  };

  return (
    <svg
      className={cn("animate-spin", sizeClasses[size])}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};

export const Button = ({
  className,
  variant,
  size,
  iconOnly = false,
  startIcon,
  endIcon,
  loading = false,
  loadingIcon,
  children,
  disabled,
  ref,
  iconWeight = "regular",
  rounded = false,
  fullWidth = false,
  ...props
}: ButtonProps & { ref?: Ref<HTMLButtonElement> }) => {
  const isDisabled = disabled || loading;
  const buttonSize = size || "md";
  const hasText = !iconOnly && children;
  const iconOnlyIcon = iconOnly ? startIcon || endIcon : null;
  const showLoadingIcon =
    loading &&
    (loadingIcon ? (
      renderIcon(loadingIcon, buttonSize, iconWeight, iconOnly)
    ) : (
      <LoadingSpinner size={buttonSize} />
    ));

  return (
    <button
      className={cn(
        buttonVariants({ variant, size, iconOnly, loading, rounded }),
        fullWidth ? "w-full" : "w-fit",
        className
      )}
      ref={ref}
      disabled={isDisabled}
      {...props}
    >
      {showLoadingIcon}

      {!loading &&
        !iconOnly &&
        startIcon &&
        renderIcon(startIcon, buttonSize, iconWeight, iconOnly)}

      {hasText && children}

      {!loading && !iconOnly && endIcon && renderIcon(endIcon, buttonSize, iconWeight, iconOnly)}

      {!loading &&
        iconOnly &&
        iconOnlyIcon &&
        renderIcon(iconOnlyIcon, buttonSize, iconWeight, iconOnly)}
    </button>
  );
};

Button.displayName = "Button";

export { buttonVariants };
export type { ButtonProps as ButtonVariantProps };
