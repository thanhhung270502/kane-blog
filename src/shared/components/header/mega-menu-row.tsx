"use client";

import { CaretRightIcon } from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";
import Link from "next/link";

import { Button } from "..";

type MegaMenuRowProps = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  href?: string;
  showChevron?: boolean;
  destructive?: boolean;
};

export const MegaMenuRow = ({
  icon,
  label,
  // onClick,
  href,
  showChevron = true,
}: MegaMenuRowProps) => {
  const content = (
    <Button
      variant="no-outlined-primary"
      startIcon={
        <div
          className={cn(
            "bg-black-quaternary flex h-9 w-9 items-center justify-center rounded-full"
          )}
        >
          {icon}
        </div>
      }
      className="justify-start gap-3!"
      endIcon={showChevron ? <CaretRightIcon size={16} className="text-tertiary" /> : undefined}
      fullWidth
    >
      <span className="flex-1 text-start">{label}</span>
    </Button>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
