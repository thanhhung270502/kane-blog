"use client";

import { useState } from "react";
import type { PostObject, UserObject } from "@common";
import { ChatCircle, HeartIcon, Share, Trash } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

import { Button, Typography, UserAvatar } from "@/shared/components";
import {
  useDeletePostMutation,
  useSharePostMutation,
  useToggleReactionMutation,
} from "@/shared/hooks";

import { CommentList } from "..";

interface PostCardProps {
  post: PostObject;
  currentUser: UserObject;
  currentUserAvatarUrl?: string | null;
  isSharedEmbed?: boolean;
}

export const PostCard = ({
  post,
  currentUser,
  currentUserAvatarUrl,
  isSharedEmbed = false,
}: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const { mutate: toggleReaction, isPending: isLiking } = useToggleReactionMutation();
  const { mutate: sharePost, isPending: isSharing } = useSharePostMutation();
  const { mutate: deletePost } = useDeletePostMutation();

  const isOwner = post.author.id === currentUser.id;

  const handleLike = () => toggleReaction({ postId: post.id });
  const handleShare = () => sharePost({ postId: post.id });
  const handleDelete = () => {
    if (confirm("Delete this post?")) deletePost(post.id);
  };

  return (
    <div
      className={cn(
        "bg-black-secondary rounded-xl shadow-md",
        isSharedEmbed ? "bg-black-tertiary" : ""
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-3">
          <UserAvatar
            name={post.author.name}
            avatarUrl={post.author.avatarUrl ?? undefined}
            size="md"
          />
          {/* <PostAuthorAvatar author={post.author} size={42} /> */}
          <div>
            <Typography variant="body-md" className="font-semibold">
              {post.author.name}
            </Typography>
            <Typography variant="body-xs" className="text-gray-400">
              {new Date(post.createdAt).toLocaleString()} ·{" "}
              <span className="capitalize">{post.visibility}</span>
            </Typography>
          </div>
        </div>
        {isOwner && !isSharedEmbed && (
          <Button variant="text-gray" size="xs" onClick={handleDelete} startIcon={Trash}>
            Delete
          </Button>
        )}
      </div>

      {/* Body */}
      {post.body && (
        <div className="px-4 py-2">
          <Typography variant="body-md">{post.body}</Typography>
        </div>
      )}

      {/* Attachments */}
      {post.attachments.length > 0 && (
        <div
          className={`grid gap-1 overflow-hidden ${post.attachments.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}
        >
          {post.attachments.slice(0, 4).map((att) => (
            <img
              key={att.id}
              src={att.url}
              alt=""
              className="w-full object-cover"
              style={{ maxHeight: 320 }}
            />
          ))}
        </div>
      )}

      {/* Shared post embed */}
      {post.sharedPost && !isSharedEmbed && (
        <div className="px-4 py-2">
          <PostCard
            post={post.sharedPost}
            currentUser={currentUser}
            currentUserAvatarUrl={currentUserAvatarUrl}
            isSharedEmbed
          />
        </div>
      )}

      {!isSharedEmbed && (
        <>
          {/* Stats row */}
          <div className="flex items-center justify-between px-4 py-1 text-sm text-gray-500">
            <span>
              {post.reactionsCount > 0 &&
                `${post.reactionsCount} like${post.reactionsCount > 1 ? "s" : ""}`}
            </span>
            <span>
              {post.commentsCount > 0 &&
                `${post.commentsCount} comment${post.commentsCount > 1 ? "s" : ""}`}
              {post.sharesCount > 0 &&
                ` · ${post.sharesCount} share${post.sharesCount > 1 ? "s" : ""}`}
            </span>
          </div>

          {/* Actions */}
          <div className="py-md px-2xl flex">
            <Button
              variant={post.viewerHasLiked ? "no-outlined-brand-secondary" : "no-outlined-primary"}
              startIcon={post.viewerHasLiked ? <HeartIcon weight="fill" /> : <HeartIcon />}
              onClick={handleLike}
              disabled={isLiking}
              type="button"
              fullWidth
            >
              Like
            </Button>
            <Button
              variant="no-outlined-primary"
              startIcon={ChatCircle}
              onClick={() => setShowComments((v) => !v)}
              type="button"
              fullWidth
            >
              Comment
            </Button>
            <Button
              variant="no-outlined-primary"
              startIcon={Share}
              onClick={handleShare}
              disabled={isSharing}
              type="button"
              fullWidth
            >
              Share
            </Button>
          </div>

          {/* Comments section */}
          {showComments && (
            <div className="px-4 pb-4">
              <CommentList
                postId={post.id}
                currentUserId={currentUser.id}
                currentUserAvatarUrl={currentUserAvatarUrl}
                currentUserName={currentUser.name}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};
