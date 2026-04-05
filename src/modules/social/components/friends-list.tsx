"use client";

import type { GetFriendsResponse } from "@common";

import { Skeleton, Typography } from "@/shared/components";

// import { useQueryFriends } from "@/shared/hooks";
import { PostAuthorAvatar } from "./post/post-author-avatar";

export const FriendsList = () => {
  // const { data, isLoading } = useQueryFriends();
  const data = { friends: [] };
  const friends = (data as GetFriendsResponse | undefined)?.friends ?? [];

  if (false) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <Typography variant="body-sm" className="text-center text-gray-400">
        No friends yet
      </Typography>
    );
  }

  return (
    <div className="space-y-2">
      {friends.map((friend) => (
        <div key={friend.id} className="flex items-center gap-3">
          <PostAuthorAvatar author={friend} size={36} />
          <Typography variant="body-sm" className="flex-1 font-medium">
            {friend.name}
          </Typography>
        </div>
      ))}
    </div>
  );
};
