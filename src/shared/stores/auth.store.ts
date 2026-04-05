import { atom } from "jotai";

export const isAuthOpenAtom = atom<boolean>(false);

/** Increment to trigger useAuthSession to refetch (e.g. after login/signup). */
export const sessionRefreshTriggerAtom = atom(0);
