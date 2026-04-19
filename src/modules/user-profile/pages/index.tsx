"use client";

import type { PostAuthorObject } from "@common";

import { PostComposer } from "@/modules/social/components";
import { Skeleton } from "@/shared/components";
import {
  useCurrentUser,
  useQueryFriends,
  useQueryUserPosts,
  useQueryUserProfile,
  useRemoveFriendMutation,
  useSendFriendRequestMutation,
  useUploadAvatarMutation,
  useUploadCoverMutation,
} from "@/shared/hooks";

import { ProfileHeader, ProfileInfoSidebar, ProfilePosts } from "../components";

interface UserProfilePageProps {
  userId: string;
}

export const UserProfilePage = ({ userId }: UserProfilePageProps) => {
  const currentUser = useCurrentUser();
  const isOwnProfile = !!currentUser.user && userId === currentUser.user.id;

  const { data: profileData, isLoading: isProfileLoading } = useQueryUserProfile(userId);
  const { data: postsData, isLoading: isPostsLoading } = useQueryUserPosts(userId);
  const { data: friendsData } = useQueryFriends();

  const { mutate: sendFriendRequest, isPending: isSendPending } = useSendFriendRequestMutation();
  const { mutate: removeFriend, isPending: isRemovePending } = useRemoveFriendMutation();
  const { mutate: uploadAvatar, isPending: isAvatarUploading } = useUploadAvatarMutation();
  const { mutate: uploadCover, isPending: isCoverUploading } = useUploadCoverMutation();

  const profile = profileData?.profile;
  const friendshipStatus = profileData?.friendshipStatus ?? null;
  const posts = postsData?.posts ?? [];

  // Find the friendship id for removal
  const myFriends = (friendsData as { friends: PostAuthorObject[] } | undefined)?.friends ?? [];
  const friendshipId = (profileData as { friendshipId?: string } | undefined)?.friendshipId ?? null;

  const handleAddFriend = () => {
    sendFriendRequest({ addresseeId: userId });
  };

  const handleRemoveFriend = () => {
    if (friendshipId) {
      removeFriend(friendshipId);
    }
  };

  if (isProfileLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-4 px-4 py-6">
        <div className="bg-black-secondary rounded-xl shadow-md">
          <Skeleton className="h-48 w-full rounded-t-xl sm:h-64" />
          <div className="p-4 sm:p-6">
            <div className="-mt-16 mb-3 flex items-end justify-between">
              <Skeleton className="h-32 w-32 rounded-full sm:h-36 sm:w-36" />
              <Skeleton className="h-9 w-32 rounded-lg" />
            </div>
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
    );
  }

  if (!profile || !currentUser.user) return null;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 px-4 py-6">
      {/* Profile header: cover + avatar + name + actions */}
      <ProfileHeader
        profile={profile}
        currentUser={currentUser.user}
        friendshipStatus={friendshipStatus}
        friendsCount={myFriends.length}
        isOwnProfile={isOwnProfile}
        onAddFriend={handleAddFriend}
        onRemoveFriend={handleRemoveFriend}
        onEditProfile={() => {}}
        isFriendPending={isSendPending || isRemovePending}
        onAvatarUpload={uploadAvatar}
        onCoverUpload={uploadCover}
        isAvatarUploading={isAvatarUploading}
        isCoverUploading={isCoverUploading}
      />

      {/* Two-column layout */}
      <div className="flex gap-4">
        {/* Left: intro + friends */}
        <div className="hidden w-80 shrink-0 md:block">
          <ProfileInfoSidebar profile={profile} friends={isOwnProfile ? myFriends : []} />
        </div>

        {/* Right: posts */}
        <div className="min-w-0 flex-1 space-y-4">
          {isOwnProfile && currentUser.user && <PostComposer currentUser={currentUser.user} />}

          <ProfilePosts posts={posts} currentUser={currentUser.user} isLoading={isPostsLoading} />
        </div>
      </div>
    </div>
  );
};
