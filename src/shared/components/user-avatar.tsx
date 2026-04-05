"use client";

import { Typography } from "./typography";

type UserAvatarSize = "sm" | "md" | "lg";
type UserAvatarProps = {
  name?: string;
  avatarUrl?: string;
  size?: UserAvatarSize;
};

export const UserAvatar = ({ name, avatarUrl, size = "md" }: UserAvatarProps) => {
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
        width={sizeMap[size]}
        height={sizeMap[size]}
        className="rounded-full object-cover"
        style={{ width: sizeMap[size], height: sizeMap[size] }}
      />
    );
  }

  return (
    <div
      className="bg-brand-secondary flex shrink-0 items-center justify-center rounded-full"
      style={{ width: sizeMap[size], height: sizeMap[size] }}
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
