"use client";

import { useState } from "react";
import type { CurrentUserObject, GetCommentsResponse } from "@common";
import { PaperPlaneRightIcon, SmileyIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { logger } from "@/libs/logger";
import { Button, Skeleton, Textarea, Typography, UserAvatar } from "@/shared/components";
import { useCreateCommentMutation, useQueryComments } from "@/shared/hooks";

interface CommentListProps {
  postId: string;
  currentUser: CurrentUserObject;
}

export const CommentList = ({ postId, currentUser }: CommentListProps) => {
  const [commentBody, setCommentBody] = useState("");
  const { data, isLoading } = useQueryComments({ input: { postId } });
  const { mutateAsync: createComment, isPending } = useCreateCommentMutation();

  const commentsData = data as GetCommentsResponse | undefined;

  const handleSubmit = async () => {
    if (!commentBody.trim()) return;
    try {
      await createComment({
        postId,
        body: {
          body: commentBody.trim(),
          author: {
            id: currentUser.id,
            name: currentUser.name,
            avatarUrl: currentUser.avatarUrl ?? null,
            username: null,
          },
        },
      });
      setCommentBody("");
    } catch (error) {
      logger.error("Failed to create comment", { error });
    }
  };

  return (
    <div className="border-black-quaternary mt-2 border-t">
      {/* Comments */}
      <div className="py-2xl space-y-2">
        {isLoading ? (
          <>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-3/4" />
          </>
        ) : commentsData?.comments.length === 0 ? (
          <Typography variant="body-sm" color="secondary" className="text-center">
            No comments yet. Be the first!
          </Typography>
        ) : (
          commentsData?.comments.map((comment) => (
            <div key={comment.id} className="flex gap-2">
              <UserAvatar
                name={comment.author.name}
                avatarUrl={comment.author.avatarUrl ?? undefined}
                size="sm"
              />
              <div className="flex-1">
                <div className="bg-black-tertiary rounded-xl px-3 py-2">
                  <Typography variant="body-xs" className="font-semibold">
                    {comment.author.name}
                  </Typography>
                  <Typography variant="body-sm">{comment.body}</Typography>
                </div>
                <Typography variant="body-xs" className="mt-1 pl-3 text-gray-400">
                  {new Date(comment.createdAt).toLocaleString()}
                </Typography>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Comment input */}
      <div className="flex gap-2">
        <UserAvatar
          name={currentUser.name}
          avatarUrl={currentUser.avatarUrl ?? undefined}
          size="sm"
        />
        <div className="flex flex-1 items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              placeholder="Write a comment..."
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              className="bg-black-tertiary text-white-primary min-h-[80px] resize-none border-0 text-base focus-visible:ring-0"
              textareaWrapperClassName={cn(
                "bg-black-tertiary border-0 rounded-xl pb-4xl",
                "hover:border-0 hover:ring-0",
                "focus-within:border-0 focus-within:ring-0",
                "focus-within:hover:border-0 focus-within:hover:ring-0"
              )}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="absolute bottom-0 left-0 flex w-full items-center justify-between">
              <Button
                variant="no-outlined-primary"
                size="xs"
                onClick={handleSubmit}
                disabled={!commentBody.trim()}
                type="button"
                startIcon={<SmileyIcon weight="fill" />}
                rounded="full"
                iconOnly
              />
              <Button
                variant="no-outlined-primary"
                size="xs"
                onClick={handleSubmit}
                disabled={!commentBody.trim()}
                type="button"
                startIcon={<PaperPlaneRightIcon weight="fill" />}
                rounded="full"
                loading={isPending}
                iconOnly
              />
            </div>
          </div>
          <Button
            variant="primary"
            size="xs"
            onClick={handleSubmit}
            disabled={!commentBody.trim() || isPending}
            type="button"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};
