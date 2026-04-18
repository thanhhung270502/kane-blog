"use client";

import type { CurrentUserObject, GetFeedResponse } from "@common";

import { useQueryFeed } from "@/shared/hooks";

import { MainFeed, PostComposer, SocialLeftSidebar, SocialRightSidebar } from "../components";

interface FeedPageProps {
  currentUser: CurrentUserObject;
}

export const FeedPage = ({ currentUser }: FeedPageProps) => {
  const { data: feedData, isLoading: isFeedLoading } = useQueryFeed();

  const feed = (feedData as GetFeedResponse | undefined)?.posts ?? [];

  return (
    <div className="flex h-full flex-1 gap-6 px-4 py-6">
      {/* Left sidebar */}
      <SocialLeftSidebar currentUser={currentUser} />

      {/* Main feed */}
      <main className="min-w-0 flex-1 space-y-4">
        <PostComposer currentUser={currentUser} />

        <MainFeed posts={feed} currentUser={currentUser} isLoading={isFeedLoading} />
      </main>

      {/* Right sidebar */}
      <SocialRightSidebar />
    </div>
  );
};
