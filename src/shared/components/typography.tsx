"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@tailwind-config/utils/cn";
import { cva, type VariantProps } from "class-variance-authority";

const typographyVariants = cva("", {
  variants: {
    variant: {
      "display-large": "display-large",
      "display-xlarge": "display-xlarge",
      "heading-lg": "heading-lg",
      "heading-md": "heading-md",
      "heading-sm": "heading-sm",
      "body-xl": "body-xl",
      "body-lg": "body-lg",
      "body-md": "body-md",
      "body-sm": "body-sm",
      "body-xs": "body-xs",
    },
    color: {
      primary: "text-primary",
      secondary: "text-secondary",
      black: "text-black",
      white: "text-white",
      disabled: "text-disabled",
      placeholder: "text-placeholder",
      "placeholder-subtle": "text-placeholder-subtle",
      error: "text-error",
      warning: "text-warning",
      success: "text-success",
    },
    weight: {
      regular: "font-regular",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      light: "font-light",
    },
    font: {
      heading: "font-heading",
    },
  },
  defaultVariants: {
    variant: "body-md",
    color: "black",
  },
});

export type TypographyElement = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "div";

const defaultElements: Record<
  NonNullable<VariantProps<typeof typographyVariants>["variant"]>,
  TypographyElement
> = {
  "display-large": "h1",
  "display-xlarge": "h1",
  "heading-lg": "h2",
  "heading-md": "h3",
  "heading-sm": "h4",
  "body-xl": "p",
  "body-lg": "p",
  "body-md": "p",
  "body-sm": "p",
  "body-xs": "p",
} as const;

export interface TypographyProps
  extends Omit<HTMLAttributes<HTMLElement>, "color">,
    VariantProps<typeof typographyVariants> {
  as?: TypographyElement;
  truncate?: boolean;
}

export const Typography = ({
  variant = "body-md",
  color = "black",
  weight,
  font,
  as,
  truncate = false,
  className,
  ...props
}: TypographyProps) => {
  const Component = as || (variant && defaultElements[variant]) || "p";

  return (
    <Component
      className={cn(
        typographyVariants({ variant, color, weight, font }),
        truncate && "truncate",
        className
      )}
      {...props}
    />
  );
};
