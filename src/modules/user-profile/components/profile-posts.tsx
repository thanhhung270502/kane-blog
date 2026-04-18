"use client";

import type { PostObject, UserObject } from "@common";

import { PostCard } from "@/modules/social/components";
import { Skeleton, Typography } from "@/shared/components";

interface ProfilePostsProps {
  posts: PostObject[];
  currentUser: UserObject;
  isLoading: boolean;
}

export const ProfilePosts = ({ posts, currentUser, isLoading }: ProfilePostsProps) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-black-secondary rounded-xl p-4 shadow-md">
            <div className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-black-secondary rounded-xl p-8 text-center shadow-md">
        <Typography variant="heading-sm" color="primary" weight="semibold">
          No posts yet
        </Typography>
        <Typography variant="body-md" color="secondary" className="mt-1">
          Posts will appear here.
        </Typography>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} currentUser={currentUser} />
      ))}
    </div>
  );
};
