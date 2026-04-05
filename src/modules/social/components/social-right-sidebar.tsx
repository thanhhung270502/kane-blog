import { BellIcon, Users } from "@phosphor-icons/react";

import { Typography } from "@/shared";

// import { useQueryPendingRequests } from "@/shared/hooks";
import { FriendRequestsPanel, FriendsList } from ".";

export const SocialRightSidebar = () => {
  // const { data: pendingData } = useQueryPendingRequests();
  const pendingData = { friendships: [] };
  const pendingCount =
    (pendingData as { friendships?: unknown[] } | undefined)?.friendships?.length ?? 0;
  return (
    <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
      <div className="bg-black-secondary rounded-xl p-4 shadow-md">
        <div className="mb-3 flex items-center gap-2">
          <BellIcon size={24} className="text-brand-secondary" weight="fill" />
          <Typography variant="body-sm" color="primary" weight="semibold">
            Friend Requests
          </Typography>
          {pendingCount > 0 && (
            <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
              {pendingCount}
            </span>
          )}
        </div>
        <FriendRequestsPanel />
      </div>

      <div className="bg-black-secondary rounded-xl p-4 shadow-md">
        <div className="mb-3 flex items-center gap-2">
          <Users size={24} className="text-brand-secondary" weight="fill" />
          <Typography variant="body-sm" color="primary" weight="semibold">
            Friends
          </Typography>
        </div>
        <FriendsList />
      </div>
    </aside>
  );
};
