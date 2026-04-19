"use client";

import type { PostAuthorObject, UserProfileObject } from "@common";
import { Calendar, Info } from "@phosphor-icons/react";

import { Separator, Typography, UserAvatar } from "@/shared/components";

interface ProfileInfoSidebarProps {
  profile: UserProfileObject;
  friends: PostAuthorObject[];
}

export const ProfileInfoSidebar = ({ profile, friends }: ProfileInfoSidebarProps) => {
  const joinedDate = new Date(profile.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <aside className="space-y-4">
      {/* Intro card */}
      <div className="bg-black-secondary rounded-xl p-4 shadow-md">
        <Typography variant="heading-sm" weight="bold" color="primary" className="mb-3">
          Intro
        </Typography>

        {profile.bio ? (
          <Typography variant="body-md" color="secondary" className="mb-3 text-center">
            {profile.bio}
          </Typography>
        ) : null}

        <Separator className="my-3" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar size={18} className="shrink-0 text-gray-400" />
            <Typography variant="body-sm" color="secondary">
              Joined {joinedDate}
            </Typography>
          </div>

          {profile.username && (
            <div className="flex items-center gap-2">
              <Info size={18} className="shrink-0 text-gray-400" />
              <Typography variant="body-sm" color="secondary">
                @{profile.username}
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Friends card */}
      {friends.length > 0 && (
        <div className="bg-black-secondary rounded-xl p-4 shadow-md">
          <div className="mb-3 flex items-center gap-2">
            <Typography variant="body-xl" weight="bold" color="primary">
              Friends
            </Typography>
            <Typography variant="body-sm" color="secondary">
              - {friends.length}
            </Typography>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {friends.slice(0, 9).map((friend) => (
              <div key={friend.id} className="flex flex-col items-center gap-2">
                <UserAvatar
                  name={friend.name}
                  avatarUrl={friend.avatarUrl ?? undefined}
                  size="lg"
                  sizeImage={100}
                />
                <Typography variant="body-xs" className="w-full truncate text-center">
                  {friend.name}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
};
