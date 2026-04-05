"use client";

import { CheckIcon, InfoIcon, Warning, XIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import { Toaster } from "sonner";

const ICON_SIZE = 20;

export function CustomToaster() {
  const baseClasses =
    "rounded-4xl border border-primary shadow-sm px-2xl py-lg flex items-center gap-md body-md font-semibold";

  return (
    <>
      <Toaster
        icons={{
          success: <CheckIcon size={ICON_SIZE} className="text-success" />,
          error: <XIcon size={ICON_SIZE} className="text-error" />,
          warning: <Warning size={ICON_SIZE} className="text-warning" />,
          info: <InfoIcon size={ICON_SIZE} className="text-brand-secondary" />,
        }}
        toastOptions={{
          unstyled: true,
          duration: 3_000,
          classNames: {
            success: cn(baseClasses, "border-success-subtle bg-success-alt text-success"),
            error: cn(baseClasses, "border-error-subtle bg-error-alt text-error"),
            warning: cn(baseClasses, "border-warning-subtle bg-warning-alt text-warning"),
            info: cn(
              baseClasses,
              "border-brand-secondary bg-brand-secondary-alt text-brand-secondary"
            ),
          },
        }}
        position="top-right"
      />
    </>
  );
}
