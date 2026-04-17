import type { CurrentUserResponse } from "@common";

import { useQueryMe, useQueryUserById } from "..";

export const useCurrentUser = (): CurrentUserResponse => {
  const { data: user, isLoading: isLoadingMe } = useQueryMe();
  const { data: userData, isLoading: isLoadingUser } = useQueryUserById({
    input: { userId: user?.id ?? "" },
    enabled: !!user?.id,
  });
  return {
    isLoading: isLoadingUser || isLoadingMe,
    user:
      user !== undefined && userData !== undefined
        ? {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            bio: userData.profile?.bio ?? undefined,
            avatarUrl: userData.profile?.avatarUrl ?? undefined,
            coverUrl: userData.profile?.coverUrl ?? undefined,
            createdAt: userData.user.createdAt,
          }
        : undefined,
  };
};
