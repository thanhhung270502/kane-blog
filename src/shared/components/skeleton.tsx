"use client";

import type { CSSProperties } from "react";
import { cn } from "@tailwind-config/utils/cn";

interface SkeletonProps {
  className?: string;
  style?: CSSProperties;
}

export const Skeleton = ({ className, style }: SkeletonProps) => {
  return <div className={cn("bg-quaternary animate-pulse rounded-md", className)} style={style} />;
};

Skeleton.displayName = "Skeleton";
