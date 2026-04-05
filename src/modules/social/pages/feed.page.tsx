"use client";

import type { GetFeedResponse, GetProfileResponse, UserObject } from "@common";

// import { useQueryFeed, useQueryMyProfile } from "@/shared/hooks";
import { MainFeed, PostComposer, SocialLeftSidebar, SocialRightSidebar } from "../components";

interface FeedPageProps {
  currentUser: UserObject;
}

export const FeedPage = ({ currentUser }: FeedPageProps) => {
  // const { data: feedData, isLoading: isFeedLoading } = useQueryFeed();
  // const { data: profileData } = useQueryMyProfile();
  const profileData = {
    profile: {
      id: "",
      userId: "0f7b555b-c510-4460-8168-4d097ddcbbe6",
      username: null,
      bio: null,
      avatarUrl: null,
      coverUrl: null,
      name: "Thanh Hùng Lý",
      createdAt: "2026-04-05T08:42:06.675Z",
    },
    friendshipStatus: null,
  };

  const feedData = {
    posts: [
      {
        id: "1b5123f3-f5ef-4eec-ae73-48c03ceca50a",
        author: {
          id: "0f7b555b-c510-4460-8168-4d097ddcbbe6",
          name: "Thanh Hùng Lý",
          avatarUrl: null,
          username: null,
        },
        body: null,
        visibility: "public",
        attachments: [],
        sharedPost: {
          id: "282f8b87-6fce-45f7-be20-116aebf7c402",
          author: {
            id: "0f7b555b-c510-4460-8168-4d097ddcbbe6",
            name: "Thanh Hùng Lý",
            avatarUrl: null,
            username: null,
          },
          body: "Hello world!",
          visibility: "public",
          attachments: [],
          sharedPost: null,
          reactionsCount: 0,
          commentsCount: 0,
          sharesCount: 1,
          viewerHasLiked: false,
          createdAt: "2026-04-05T06:55:29.312Z",
          updatedAt: "2026-04-05T06:55:29.312Z",
        },
        reactionsCount: 1,
        commentsCount: 0,
        sharesCount: 0,
        viewerHasLiked: true,
        createdAt: "2026-04-05T08:04:01.975Z",
        updatedAt: "2026-04-05T08:04:01.975Z",
      },
      {
        id: "282f8b87-6fce-45f7-be20-116aebf7c402",
        author: {
          id: "0f7b555b-c510-4460-8168-4d097ddcbbe6",
          name: "Thanh Hùng Lý",
          avatarUrl: null,
          username: null,
        },
        body: "Hello world!",
        visibility: "public",
        attachments: [],
        sharedPost: null,
        reactionsCount: 1,
        commentsCount: 0,
        sharesCount: 1,
        viewerHasLiked: true,
        createdAt: "2026-04-05T06:55:29.312Z",
        updatedAt: "2026-04-05T06:55:29.312Z",
      },
    ],
    nextCursor: null,
    hasMore: false,
  };

  const feed = (feedData as GetFeedResponse | undefined)?.posts ?? [];
  const avatarUrl = (profileData as GetProfileResponse | undefined)?.profile?.avatarUrl ?? null;

  return (
    <div className="flex h-full flex-1 gap-6 px-4 py-6">
      {/* Left sidebar */}
      <SocialLeftSidebar currentUser={currentUser} />

      {/* Main feed */}
      <main className="min-w-0 flex-1 space-y-4">
        <PostComposer currentUser={currentUser} avatarUrl={avatarUrl} />

        <MainFeed posts={feed} currentUser={currentUser} avatarUrl={avatarUrl} isLoading={false} />
      </main>

      {/* Right sidebar */}
      <SocialRightSidebar />
    </div>
  );
};
