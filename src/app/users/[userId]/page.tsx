"use client";

import { use } from "react";

import { UserProfilePage } from "@/modules/user-profile";

export default function Page({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = use(params);
  return <UserProfilePage userId={userId} />;
}
