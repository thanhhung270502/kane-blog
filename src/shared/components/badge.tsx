"use client";

import type { HTMLAttributes, ReactNode, Ref } from "react";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const badgeVariants = cva(
  ["inline-flex items-center justify-center", "select-none whitespace-nowrap", "font-medium"],
  {
    variants: {
      variant: {
        // Default
        white: ["bg-white text-black border-secondary"],
        gray: ["bg-neutral-400 text-neutral-900 border-neutral-200"],
        primary: ["bg-brand-primary text-white border-brand-primary"],
        secondary: ["bg-brand-secondary text-white border-brand-secondary"],
        // brand: ["bg-brand-primary-alt text-brand-primary border-brand-primary-alt"],
        error: ["bg-error text-white border-error"],
        warning: ["bg-warning text-white border-warning"],
        success: ["bg-success text-white border-success"],
        info: ["bg-info text-white border-info"],
        teal: ["bg-teal text-white border-teal"],
        // Number - brand, orange, neutral
        neutral: ["bg-neutral-200 text-neutral-900 border-neutral-200"],
      },
      size: {
        small: ["body-xs", "px-sm py-xxs"],
        medium: ["body-sm", "px-md py-xs"],
        large: ["body-lg", "px-lg py-sm"],
      },
      shape: {
        "full-rounded": ["rounded-4xl h-auto w-auto min-w-max"],
        rectangle: ["h-auto w-auto min-w-max"],
      },
      type: {
        number: ["h-4 w-4 min-w-4 rounded-full border-none"],
        label: ["h-auto w-fit min-w-max gap-xs border"],
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "medium",
      shape: "rectangle",
      type: "label",
    },
  }
);

interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  children: ReactNode;
}

export const Badge = ({
  className,
  variant,
  size,
  shape,
  type,
  children,
  ref,
  ...props
}: BadgeProps & { ref?: Ref<HTMLSpanElement> }) => {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ variant, size, shape, type }), className)}
      {...props}
    >
      {children}
    </span>
  );
};

Badge.displayName = "Badge";

export type { BadgeProps };
