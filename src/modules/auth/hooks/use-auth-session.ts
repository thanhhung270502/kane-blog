"use client";

import { EUserRole } from "@common";

import { useQueryMe } from "@/shared";

export const useAuthSession = () => {
  const { data: user, isLoading } = useQueryMe();

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === EUserRole.ADMIN,
  };
};
