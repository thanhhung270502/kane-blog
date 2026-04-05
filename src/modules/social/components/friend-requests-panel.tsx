"use client";

import type { GetPendingFriendRequestsResponse } from "@common";
import { EFriendshipStatus } from "@common";
import { Check, X } from "@phosphor-icons/react";

import { Button, Skeleton, Typography } from "@/shared/components";
// import { useQueryPendingRequests, useRespondFriendRequestMutation } from "@/shared/hooks";
import { useRespondFriendRequestMutation } from "@/shared/hooks";

import { PostAuthorAvatar } from "./post/post-author-avatar";

export const FriendRequestsPanel = () => {
  // const { data, isLoading } = useQueryPendingRequests();
  const data: GetPendingFriendRequestsResponse = { friendships: [] };
  const { mutate: respond, isPending } = useRespondFriendRequestMutation();

  const pending = (data as GetPendingFriendRequestsResponse | undefined)?.friendships ?? [];

  if (false) {
    return (
      <div className="space-y-2">
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    );
  }

  if (pending.length === 0) {
    return (
      <Typography variant="body-sm" className="text-center text-gray-400">
        No pending friend requests
      </Typography>
    );
  }

  return (
    <div className="space-y-3">
      {pending.map((req) => (
        <div key={req.id} className="flex items-center gap-3">
          <PostAuthorAvatar author={req.requester} size={40} />
          <div className="flex-1">
            <Typography variant="body-sm" className="font-semibold">
              {req.requester.name}
            </Typography>
            <Typography variant="body-xs" className="text-gray-400">
              {new Date(req.createdAt).toLocaleDateString()}
            </Typography>
          </div>
          <div className="flex gap-1">
            <Button
              variant="primary"
              size="xs"
              startIcon={Check}
              disabled={isPending}
              onClick={() => respond({ id: req.id, data: { status: EFriendshipStatus.ACCEPTED } })}
              type="button"
            >
              Accept
            </Button>
            <Button
              variant="outlined-gray"
              size="xs"
              startIcon={X}
              disabled={isPending}
              onClick={() => respond({ id: req.id, data: { status: EFriendshipStatus.REJECTED } })}
              type="button"
            >
              Decline
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
