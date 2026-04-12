"use client";

import { useState } from "react";
import type { UserObject } from "@common";

import { UserAvatar } from "@/shared/components";

import { PostComposerDialog } from "..";

interface PostComposerProps {
  currentUser: UserObject;
  avatarUrl?: string | null;
}

export const PostComposer = ({ currentUser, avatarUrl }: PostComposerProps) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="p-2xl bg-black-secondary rounded-xl shadow-md">
      <div className="flex gap-3">
        <UserAvatar name={currentUser.name} avatarUrl={avatarUrl ?? undefined} size="md" />
        <button
          className="bg-black-tertiary px-2xl py-lg hover:bg-black-quaternary flex-1 cursor-pointer rounded-xl text-left"
          onClick={() => setOpen(true)}
        >
          {currentUser.name}, what's on your mind?
        </button>
      </div>
      <PostComposerDialog
        currentUser={currentUser}
        avatarUrl={avatarUrl}
        open={open}
        setOpen={setOpen}
      />
    </div>
  );
};
