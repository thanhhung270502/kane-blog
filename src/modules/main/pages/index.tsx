"use client";

import type { UserObject } from "@common";

import { FeedPage } from "@/modules/social";

interface MainPageProps {
  currentUser: UserObject;
}

export const MainPage = ({ currentUser }: MainPageProps) => {
  return <FeedPage currentUser={currentUser} />;
};
