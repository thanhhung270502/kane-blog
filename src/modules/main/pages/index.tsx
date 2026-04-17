"use client";

import { redirect } from "next/navigation";

import { FeedPage } from "@/modules/social";
import { Skeleton, useCurrentUser } from "@/shared";

export const MainPage = () => {
  const currentUser = useCurrentUser();

  if (currentUser.isLoading) {
    return (
      <div className="flex h-full flex-1 gap-6 px-4 py-6">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-64" />
          <Skeleton className="h-40 w-64" />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
        <div className="flex flex-col gap-4">
          <Skeleton className="h-20 w-64" />
          <Skeleton className="h-40 w-64" />
        </div>
      </div>
    );
  }

  if (currentUser.user) {
    return (
      <>
        <FeedPage currentUser={currentUser.user} />
      </>
    );
  }
  redirect("/login");
};
