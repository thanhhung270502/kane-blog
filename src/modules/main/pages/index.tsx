"use client";

import type { UserObject } from "@common";

import { FeedPage } from "@/modules/social";
import { Header } from "@/shared";

interface MainPageProps {
  currentUser: UserObject;
}

export const MainPage = ({ currentUser }: MainPageProps) => {
  return (
    <>
      <Header />
      <FeedPage currentUser={currentUser} />
    </>
  );
};
