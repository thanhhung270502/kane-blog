"use client";

import { cn } from "@tailwind-config/utils/cn";

import { Typography } from "./typography";

type UserAvatarSize = "sm" | "md" | "lg";
type UserAvatarProps = {
  name?: string;
  avatarUrl?: string;
  size?: UserAvatarSize;
  className?: string;
  sizeImage?: number;
};

export const UserAvatar = ({
  name,
  avatarUrl,
  size = "md",
  className,
  sizeImage,
}: UserAvatarProps) => {
  const sizeMap = {
    sm: 32,
    md: 40,
    lg: 48,
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name ?? "User"}
        width={sizeImage ?? sizeMap[size]}
        height={sizeImage ?? sizeMap[size]}
        className={cn("rounded-full object-cover", className)}
        style={{ width: sizeImage ?? sizeMap[size], height: sizeImage ?? sizeMap[size] }}
      />
    );
  }

  return (
    <div
      className={cn(
        "bg-brand-secondary flex shrink-0 items-center justify-center rounded-full",
        className
      )}
      style={{ width: sizeImage ?? sizeMap[size], height: sizeImage ?? sizeMap[size] }}
    >
      <Typography
        variant={size === "sm" ? "body-sm" : size === "md" ? "body-md" : "body-lg"}
        color="white"
        weight="semibold"
      >
        {initials}
      </Typography>
    </div>
  );
};
