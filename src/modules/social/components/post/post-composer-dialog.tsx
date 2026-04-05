"use client";

import { useState } from "react";
import type { UserObject } from "@common";
import { EPostVisibility } from "@common";
import { Image, PaperPlaneRight, XIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  Textarea,
  Typography,
  UserAvatar,
} from "@/shared/components";
import { useCreatePostMutation } from "@/shared/hooks";

import { PostVisibilitySelector } from "..";

import { PostAuthorAvatar } from "./post-author-avatar";

interface PostComposerDialogProps {
  currentUser: UserObject;
  avatarUrl?: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export const PostComposerDialog = ({
  currentUser,
  avatarUrl,
  open,
  setOpen,
}: PostComposerDialogProps) => {
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<EPostVisibility>(EPostVisibility.PUBLIC);
  const { mutate: createPost, isPending } = useCreatePostMutation();

  const handleSubmit = () => {
    if (!body.trim()) return;
    createPost(
      { body: body.trim(), visibility },
      {
        onSuccess: () => {
          setBody("");
          setVisibility(EPostVisibility.PUBLIC);
        },
      }
    );
  };

  const author = {
    id: currentUser.id,
    name: currentUser.name,
    avatarUrl: avatarUrl ?? null,
    username: null,
  };

  const isDisabled = !body.trim();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black-secondary max-h-[90vh] w-full max-w-md rounded-xl p-0">
        <div className="border-black-quaternary p-2xl flex items-center justify-between border-b">
          <DialogTitle className="flex-1 text-center">Create a post</DialogTitle>
          <DialogClose
            nativeButton={false}
            render={<XIcon size={20} className="text-white-primary cursor-pointer outline-0" />}
          />
        </div>
        <div className="flex flex-col">
          <div className="p-2xl flex items-center gap-2">
            <UserAvatar name={currentUser.name} avatarUrl={avatarUrl ?? undefined} size="md" />
            <div className="flex flex-1 flex-col">
              <Typography variant="body-sm" className="font-semibold">
                {currentUser.name}
              </Typography>
              <PostVisibilitySelector visibility={visibility} setVisibility={setVisibility} />
            </div>
          </div>

          <Textarea
            placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="bg-black-secondary text-white-primary min-h-[80px] resize-none border-0 text-base focus-visible:ring-0"
            textareaWrapperClassName={cn(
              "bg-black-secondary border-0",
              "hover:border-0 hover:ring-0",
              "focus-within:border-0 focus-within:ring-0",
              "focus-within:hover:border-0 focus-within:hover:ring-0"
            )}
          />

          <div className="px-2xl py-xl mt-3 flex items-center justify-between">
            <Button
              type="button"
              variant={isDisabled ? "black-primary" : "secondary"}
              onClick={handleSubmit}
              disabled={isDisabled}
              fullWidth
              loading={isPending}
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex gap-3">
        <PostAuthorAvatar author={author} size={42} />
        <div className="flex-1">
          <Textarea
            placeholder={`What's on your mind, ${currentUser.name.split(" ")[0]}?`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[80px] resize-none border-0 bg-gray-50 text-base focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2">
          <Button variant="text-gray" size="sm" startIcon={Image} type="button">
            Photo
          </Button>
          {/* <Select
            value={visibility}
            onValueChange={(v) => setVisibility(v as EPostVisibility)}
            options={[
              { label: "Public", value: EPostVisibility.PUBLIC },
              { label: "Friends", value: EPostVisibility.FRIENDS },
            ]}
            placeholder="Visibility"
            className="h-8 w-28 text-sm"
          /> */}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleSubmit}
          disabled={!body.trim() || isPending}
          startIcon={PaperPlaneRight}
          type="button"
        >
          Post
        </Button>
      </div>
    </div>
  );
};
