"use client";

import { breakpoints } from "@tailwind-config/breakpoints";

import { useMediaQuery } from "./useMediaQuery";

const BreakPointHooks = <BreakPoints extends Record<string, number>>(breakpoints: BreakPoints) => {
  type BreakPointsKey = keyof BreakPoints;
  return {
    useGreater: (k: BreakPointsKey) => {
      return useMediaQuery(`(min-width: ${breakpoints[k]}px)`);
    },
    useSmaller: (k: BreakPointsKey) => {
      return useMediaQuery(`(max-width: ${(breakpoints[k] as number) - 1}px)`);
    },
    useBetween: (a: BreakPointsKey, b: BreakPointsKey) => {
      return useMediaQuery(
        `(min-width: ${breakpoints[a]}px) and (max-width: ${(breakpoints[b] as number) - 1}px)`
      );
    },
  };
};

const { useGreater, useSmaller, useBetween } = BreakPointHooks(breakpoints);

export type BreakPointHooksReturn = ReturnType<typeof BreakPointHooks>;
export { useBetween, useGreater, useSmaller };
