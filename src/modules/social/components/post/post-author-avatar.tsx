"use client";

import type { PostAuthorObject } from "@common";
import { UserCircle } from "@phosphor-icons/react";

interface PostAuthorAvatarProps {
  author: PostAuthorObject;
  size?: number;
}

export const PostAuthorAvatar = ({ author, size = 40 }: PostAuthorAvatarProps) => {
  if (author.avatarUrl) {
    return (
      <img
        src={author.avatarUrl}
        alt={author.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    );
  }

  return (
    <div
      className="flex items-center justify-center rounded-full bg-gray-200 text-gray-500"
      style={{ width: size, height: size }}
    >
      <UserCircle size={size * 0.65} />
    </div>
  );
};
