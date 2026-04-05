"use client";

import { ArrowDownIcon, ArrowUpIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import type { SortDirection } from "@tanstack/react-table";

interface SortDirectionIconProps {
  direction: SortDirection;
  size?: number;
  className?: string;
}

export const SortDirectionIcon = ({ direction, size = 16, className }: SortDirectionIconProps) => {
  const IconComponent = direction === "asc" ? ArrowUpIcon : ArrowDownIcon;

  return <IconComponent size={size} className={cn("text-brand-quaternary", className)} />;
};

SortDirectionIcon.displayName = "SortDirectionIcon";
