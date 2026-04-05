"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { useQueryStates } from "nuqs";

import { AUTH_SEARCH_PARAMS, AuthSearchParams, SearchParams } from "@/shared";

import { isAuthOpenAtom } from "../stores";

export const useAuthRequest = () => {
  const [{ auth }, setAuthRequest] = useQueryStates(AUTH_SEARCH_PARAMS);
  const [isAuthOpen, setIsAuthOpen] = useAtom(isAuthOpenAtom);

  useEffect(() => {
    if (auth === "login" || auth === "signup") {
      setIsAuthOpen(true);
    } else {
      setIsAuthOpen(false);
    }
  }, [auth, setIsAuthOpen]);

  const isLoginOpen = isAuthOpen && auth === "login";
  const isSignupOpen = isAuthOpen && auth === "signup";

  const handleOpenLogin = () => {
    setIsAuthOpen(true);
    setAuthRequest({ [SearchParams.Auth]: AuthSearchParams.Login });
  };

  const handleOpenSignup = () => {
    setIsAuthOpen(true);
    setAuthRequest({ [SearchParams.Auth]: AuthSearchParams.Signup });
  };

  const handleLoginOpenChange = (open: boolean) => {
    if (open) {
      handleOpenLogin();
    } else {
      setIsAuthOpen(false);
      setAuthRequest({ [SearchParams.Auth]: null });
    }
  };

  const handleSignupOpenChange = (open: boolean) => {
    if (open) {
      handleOpenSignup();
    } else {
      setIsAuthOpen(false);
      setAuthRequest({ [SearchParams.Auth]: null });
    }
  };

  return {
    isLoginOpen,
    isSignupOpen,
    onLoginOpenChange: handleLoginOpenChange,
    onSignupOpenChange: handleSignupOpenChange,
    onOpenLogin: handleOpenLogin,
    onOpenSignup: handleOpenSignup,
  };
};
