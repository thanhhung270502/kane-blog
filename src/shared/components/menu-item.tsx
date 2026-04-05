"use client";

import type React from "react";
import { cva } from "class-variance-authority";

const itemVariants = cva(
  [
    "flex items-center gap-md px-lg py-md cursor-pointer transition-colors rounded-sm",
    "font-medium body-md outline-none w-full",
  ],
  {
    variants: {
      state: {
        default: "bg-white text-primary",
        highlighted: "bg-brand-primary",
        disabled: "bg-white text-disabled cursor-not-allowed",
      },
    },
    defaultVariants: {
      state: "default",
    },
  }
);

type MenuItemContentProps = {
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
};

export const MenuItemContent = ({ icon: IconComponent, children }: MenuItemContentProps) => {
  return (
    <>
      {IconComponent && (
        <IconComponent
          size={20}
          className="text-secondary group-hover:text-brand-tertiary transition-colors"
        />
      )}
      <span className="text-primary group-hover:text-brand-tertiary transition-colors">
        {children}
      </span>
    </>
  );
};

export { itemVariants };
