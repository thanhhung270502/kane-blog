"use client";

import { createElement } from "react";
import { CircleNotchIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { Typography } from "..";

const ICON_SIZE = {
  xs: 14,
  sm: 18,
  md: 24,
  lg: 30,
  xl: 36,
};

const TEXT_SIZE = {
  xs: "body-xs" as const,
  sm: "body-sm" as const,
  md: "body-md" as const,
  lg: "body-lg" as const,
  xl: "body-xl" as const,
};

type LoadingProps = {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  text?: string;
  className?: string;
  iconClassName?: string;
  textClassName?: string;
};

export const Loading = ({
  size = "md",
  text,
  className,
  iconClassName,
  textClassName,
}: LoadingProps) => {
  const renderIcon = createElement(CircleNotchIcon, {
    size: ICON_SIZE[size],
    className: cn("animate-spin text-black", iconClassName),
    "aria-hidden": "true", // Icons are decorative when there's text
  });
  return (
    <div className={cn("flex h-full flex-col items-center justify-center gap-2", className)}>
      {renderIcon}
      {text && (
        <Typography
          variant={TEXT_SIZE[size]}
          weight="medium"
          className={cn("animate-bounce text-black", textClassName)}
        >
          {text}
        </Typography>
      )}
    </div>
  );
};
