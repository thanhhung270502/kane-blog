"use client";

import type { ReactNode } from "react";
import { Popover as BasePopover } from "@base-ui/react/popover";
import { cn } from "@tailwind-config/utils/cn";

type PopoverRootProps = BasePopover.Root.Props;

export type PopoverChangeEventDetails = BasePopover.Root.ChangeEventDetails;

const Popover = ({ children, ...props }: PopoverRootProps) => {
  return <BasePopover.Root {...props}>{children}</BasePopover.Root>;
};

// Trigger
type PopoverTriggerProps = BasePopover.Trigger.Props & { children?: ReactNode };
const PopoverTrigger = ({ className, children, ...props }: PopoverTriggerProps) => {
  return (
    <BasePopover.Trigger className={cn("focus-visible:outline-none", className)} {...props}>
      {children}
    </BasePopover.Trigger>
  );
};

type PopoverContentProps = BasePopover.Positioner.Props & { popupClassName?: string };

const PopoverContent = ({
  children,
  side,
  align,
  sideOffset = 8,
  className,
  popupClassName,
  ...props
}: PopoverContentProps) => {
  const popupClasses = cn(popupClassName);

  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn("z-popover pointer-events-auto outline-none", className)}
        {...props}
      >
        <BasePopover.Popup className={popupClasses}>{children}</BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
};

const PopoverTitle = BasePopover.Title;
const PopoverDescription = BasePopover.Description;
const PopoverClose = BasePopover.Close;

export { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverTitle, PopoverTrigger };
