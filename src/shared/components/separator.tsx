"use client";

import { Separator as BaseSeparator } from "@base-ui-components/react/separator";
import { cn } from "@tailwind-config/utils/cn";
import { cva } from "class-variance-authority";

const separatorVariants = cva("bg-quaternary", {
  variants: {
    orientation: {
      horizontal: "h-px",
      vertical: "w-px self-stretch",
    },
  },
});

export const Separator = ({ className, orientation = "horizontal", ...props }: SeparatorProps) => {
  return <BaseSeparator className={cn(separatorVariants({ orientation }), className)} {...props} />;
};

Separator.displayName = "Separator";
export type SeparatorProps = BaseSeparator.Props;
