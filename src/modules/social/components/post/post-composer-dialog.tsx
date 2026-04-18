"use client";

import { useEffect, useRef, useState } from "react";
import type { CurrentUserObject } from "@common";
import { EAttachmentKind, EPostVisibility } from "@common";
import { Image, Trash, VideoCamera, XIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { uploadPostMediaFile } from "@/shared/apis";
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

interface PostComposerDialogProps {
  currentUser: CurrentUserObject;
  avatarUrl?: string | null;
  open: boolean;
  setOpen: (open: boolean) => void;
}

interface MediaPreview {
  file: File;
  objectUrl: string;
  kind: EAttachmentKind;
}

export const PostComposerDialog = ({
  currentUser,
  avatarUrl,
  open,
  setOpen,
}: PostComposerDialogProps) => {
  const [body, setBody] = useState("");
  const [visibility, setVisibility] = useState<EPostVisibility>(EPostVisibility.PUBLIC);
  const [media, setMedia] = useState<MediaPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mutateAsync: createPost, isPending } = useCreatePostMutation();

  useEffect(() => {
    if (!open) return;
    return () => {
      media.forEach((m) => URL.revokeObjectURL(m.objectUrl));
    };
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const remaining = 4 - media.length;
    const accepted = files.slice(0, remaining);

    const newPreviews: MediaPreview[] = accepted.map((file) => ({
      file,
      objectUrl: URL.createObjectURL(file),
      kind: file.type.startsWith("video/") ? EAttachmentKind.VIDEO : EAttachmentKind.IMAGE,
    }));

    setMedia((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => {
      URL.revokeObjectURL(prev[index].objectUrl);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (!body.trim() && media.length === 0) return;

    let attachments: NonNullable<Parameters<typeof createPost>[0]["attachments"]> = [];
    if (media.length > 0) {
      const tempPostId = crypto.randomUUID();
      attachments = await Promise.all(
        media.map((m, index) => uploadPostMediaFile(m.file, tempPostId, index))
      );
    }

    await createPost({
      body: body.trim() || undefined,
      visibility,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    media.forEach((m) => URL.revokeObjectURL(m.objectUrl));
    setMedia([]);
    setBody("");
    setVisibility(EPostVisibility.PUBLIC);
    setOpen(false);
  };

  const isDisabled = !body.trim() && media.length === 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-black-secondary max-h-[90vh] w-full max-w-md overflow-y-auto rounded-xl p-0">
        <div className="border-black-quaternary p-2xl flex items-center justify-between border-b">
          <DialogTitle className="flex-1 text-center">Create a post</DialogTitle>
          <DialogClose
            nativeButton={false}
            render={<XIcon size={20} className="text-white-primary cursor-pointer outline-0" />}
          />
        </div>

        <div className="flex flex-col">
          {/* Author row */}
          <div className="p-2xl flex items-center gap-2">
            <UserAvatar name={currentUser.name} avatarUrl={avatarUrl ?? undefined} size="md" />
            <div className="flex flex-1 flex-col">
              <Typography variant="body-sm" className="font-semibold">
                {currentUser.name}
              </Typography>
              <PostVisibilitySelector visibility={visibility} setVisibility={setVisibility} />
            </div>
          </div>

          {/* Text input */}
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

          {/* Media previews */}
          {media.length > 0 && (
            <div
              className={cn(
                "mx-2xl mb-2 grid gap-1 overflow-hidden rounded-lg",
                media.length === 1 ? "grid-cols-1" : "grid-cols-2"
              )}
            >
              {media.map((m, i) => (
                <div key={m.objectUrl} className="group relative">
                  {m.kind === EAttachmentKind.VIDEO ? (
                    <video
                      src={m.objectUrl}
                      className="h-40 w-full rounded object-cover"
                      muted
                    />
                  ) : (
                    <img
                      src={m.objectUrl}
                      alt=""
                      className="h-40 w-full rounded object-cover"
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveMedia(i)}
                    className="absolute top-1 right-1 rounded-full bg-black/60 p-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <Trash size={14} className="text-white" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Toolbar + submit */}
          <div className="border-black-quaternary px-2xl py-xl flex items-center justify-between border-t">
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/quicktime,video/webm"
                multiple
                className="hidden"
                onChange={handleFileSelect}
                disabled={media.length >= 4}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={media.length >= 4}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                  media.length >= 4
                    ? "text-gray-600 cursor-not-allowed"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                )}
              >
                <Image size={18} />
                <VideoCamera size={18} />
                <span>Photo / Video</span>
              </button>
            </div>

            <Button
              type="button"
              variant={isDisabled ? "black-primary" : "secondary"}
              onClick={handleSubmit}
              disabled={isDisabled}
              loading={isPending}
            >
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
