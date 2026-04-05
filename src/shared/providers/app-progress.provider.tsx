"use client";

import type { PropsWithChildren } from "react";
import { ProgressProvider } from "@bprogress/next/app";

const PROGRESS_BAR_HEIGHT = 2;

export const AppProgressProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <ProgressProvider
      height={`${PROGRESS_BAR_HEIGHT}px`}
      color="var(--color-brand-orange-200)"
      options={{ showSpinner: false }}
      shallowRouting
    >
      {children}
    </ProgressProvider>
  );
};
