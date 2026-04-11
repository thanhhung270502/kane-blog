"use client";

import type { EFriendshipStatus, UserObject, UserProfileObject } from "@common";
import { Camera, PencilSimple, UserMinus, UserPlus } from "@phosphor-icons/react";

import { Button, Typography } from "@/shared/components";

const ProfileAvatar = ({ name, avatarUrl }: { name: string; avatarUrl?: string }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="h-32 w-32 rounded-full object-cover sm:h-36 sm:w-36"
      />
    );
  }

  return (
    <div className="bg-brand-secondary flex h-32 w-32 items-center justify-center rounded-full sm:h-36 sm:w-36">
      <span className="text-4xl font-bold text-white">{initials}</span>
    </div>
  );
};

interface ProfileHeaderProps {
  profile: UserProfileObject;
  currentUser: UserObject;
  friendshipStatus: EFriendshipStatus | null;
  friendsCount: number;
  isOwnProfile: boolean;
  onAddFriend: () => void;
  onRemoveFriend: () => void;
  onEditProfile: () => void;
  isFriendPending: boolean;
}

export const ProfileHeader = ({
  profile,
  currentUser,
  friendshipStatus,
  friendsCount,
  isOwnProfile,
  onAddFriend,
  onRemoveFriend,
  onEditProfile,
  isFriendPending,
}: ProfileHeaderProps) => {
  const isFriend = friendshipStatus === "accepted";
  const isPending = friendshipStatus === "pending";

  return (
    <div className="bg-black-secondary rounded-xl shadow-md">
      {/* Cover photo */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-xl bg-linear-to-br from-blue-900 via-purple-900 to-indigo-900 sm:h-64">
        {profile.coverUrl ? (
          <img src={profile.coverUrl} alt="Cover" className="h-full w-full object-cover" />
        ) : null}
        {isOwnProfile && (
          <button className="absolute right-3 bottom-3 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-1.5 text-white transition hover:bg-black/80">
            <Camera size={16} />
            <span className="text-sm">Edit cover photo</span>
          </button>
        )}
      </div>

      {/* Avatar + info row */}
      <div className="px-4 pb-4 sm:px-6">
        {/* Avatar — overlaps cover */}
        <div className="relative -mt-16 mb-3 flex items-end justify-between">
          <div className="relative">
            <div className="ring-black-secondary rounded-full ring-4">
              <ProfileAvatar
                name={profile.name || currentUser.name}
                avatarUrl={profile.avatarUrl ?? undefined}
              />
            </div>
            {isOwnProfile && (
              <button className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full bg-gray-600 text-white shadow hover:bg-gray-500">
                <Camera size={14} />
              </button>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 pb-1">
            {isOwnProfile ? (
              <Button
                variant="secondary"
                size="sm"
                startIcon={PencilSimple}
                onClick={onEditProfile}
              >
                Edit profile
              </Button>
            ) : isFriend ? (
              <Button
                variant="outlined-secondary"
                size="sm"
                startIcon={UserMinus}
                onClick={onRemoveFriend}
                loading={isFriendPending}
              >
                Friends
              </Button>
            ) : isPending ? (
              <Button variant="secondary" size="sm" loading={isFriendPending} disabled>
                Request sent
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                startIcon={UserPlus}
                onClick={onAddFriend}
                loading={isFriendPending}
              >
                Add friend
              </Button>
            )}
          </div>
        </div>

        {/* Name + stats */}
        <Typography variant="heading-lg" weight="bold" color="primary">
          {profile.name || currentUser.name}
        </Typography>
        {profile.username && (
          <Typography variant="body-sm" color="secondary">
            @{profile.username}
          </Typography>
        )}
        <Typography variant="body-sm" color="secondary" className="mt-1">
          {friendsCount} {friendsCount === 1 ? "friend" : "friends"}
        </Typography>
      </div>
    </div>
  );
};
