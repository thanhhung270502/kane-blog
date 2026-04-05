"use client";

import type React from "react";
import { Menu as BaseMenu } from "@base-ui/react/menu";
import { cn } from "@tailwind-config/utils/cn";

import { Button } from "./button";
import { itemVariants, MenuItemContent } from "./menu-item";

const Menu = BaseMenu.Root;

type MenuContentProps = {
  popupClassName?: string;
} & BaseMenu.Positioner.Props;

const MenuContent = ({ children, className, popupClassName, ...props }: MenuContentProps) => {
  return (
    <BaseMenu.Portal>
      <BaseMenu.Positioner
        className={cn("z-dropdown pointer-events-auto outline-none", className)}
        {...props}
      >
        <BaseMenu.Popup
          className={cn(
            "rounded-xl bg-white shadow-lg ring-0 outline-none",
            "min-w-48",
            popupClassName
          )}
        >
          <div className="p-sm gap-xxs flex flex-col" role="menu">
            {children}
          </div>
        </BaseMenu.Popup>
      </BaseMenu.Positioner>
    </BaseMenu.Portal>
  );
};

type MenuItemProps = BaseMenu.Item.Props & {
  className?: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
};

const MenuItem = ({ className, icon, children, ...props }: MenuItemProps) => {
  return (
    <BaseMenu.Item
      className={(state) => {
        const itemState = state.disabled
          ? "disabled"
          : state.highlighted
            ? "highlighted"
            : "default";
        return cn(itemVariants({ state: itemState }), "group", className);
      }}
      {...props}
    >
      <MenuItemContent icon={icon}>{children}</MenuItemContent>
    </BaseMenu.Item>
  );
};

type MenuTriggerProps = BaseMenu.Trigger.Props;
const MenuTrigger = ({
  className,
  nativeButton = true,
  children,
  openOnHover,
  delay,
  closeDelay,
  ...props
}: MenuTriggerProps) => {
  if (nativeButton) {
    return (
      <BaseMenu.Trigger
        openOnHover={openOnHover}
        delay={delay}
        closeDelay={closeDelay}
        {...props}
        render={<Button variant="text-primary" className={cn(className)} />}
      >
        {children}
      </BaseMenu.Trigger>
    );
  }
  return (
    <BaseMenu.Trigger
      nativeButton={false}
      openOnHover={openOnHover}
      delay={delay}
      closeDelay={closeDelay}
      className={cn(className)}
      {...props}
    >
      {children}
    </BaseMenu.Trigger>
  );
};

type MenuSeparatorProps = {
  className?: string;
};

const MenuSeparator = ({ className }: MenuSeparatorProps) => {
  return <BaseMenu.Separator className={cn("bg-quaternary my-xs h-px", className)} />;
};

type MenuLabelProps = {
  children: React.ReactNode;
  className?: string;
};

const MenuLabel = ({ children, className }: MenuLabelProps) => {
  return (
    <BaseMenu.GroupLabel
      className={cn("px-lg py-sm body-sm text-tertiary font-semibold", className)}
    >
      {children}
    </BaseMenu.GroupLabel>
  );
};

const MenuGroup = BaseMenu.Group;

export { Menu, MenuContent, MenuGroup, MenuItem, MenuLabel, MenuSeparator, MenuTrigger };
