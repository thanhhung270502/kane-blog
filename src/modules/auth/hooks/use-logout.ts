"use client";

import { useRouter } from "@bprogress/next/app";

import { logger } from "@/libs/logger";
import { asError, useLogoutMutation } from "@/shared";

export const useLogout = () => {
  const router = useRouter();

  const logoutMutation = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation.mutateAsync({});
      router.push("/");
    } catch (error) {
      logger.error(asError(error).message);
    }
  };

  return {
    logout,
    isLoggingOut: logoutMutation.isPending,
  };
};
