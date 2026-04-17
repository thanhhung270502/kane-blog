import type { CurrentUserObject } from "@common";

import { Typography, UserAvatar } from "@/shared";

type SocialLeftSidebarProps = {
  currentUser: CurrentUserObject;
};

export const SocialLeftSidebar = ({ currentUser }: SocialLeftSidebarProps) => {
  return (
    <aside className="hidden w-64 shrink-0 space-y-4 lg:block">
      <div className="bg-black-secondary rounded-xl p-4 shadow-md">
        <div className="flex items-center gap-3">
          <UserAvatar name={currentUser.name} avatarUrl={currentUser.avatarUrl ?? undefined} />
          <div>
            <Typography variant="body-md" color="primary" weight="semibold">
              {currentUser.name}
            </Typography>
            <Typography variant="body-xs" color="secondary">
              {currentUser.email}
            </Typography>
          </div>
        </div>
      </div>
    </aside>
  );
};
