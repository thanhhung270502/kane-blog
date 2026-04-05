"use client";

import React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@tailwind-config/utils/cn";

type TabsProps = React.ComponentPropsWithoutRef<typeof Tabs> & {
  className?: string;
  items?: Array<{
    value: string;
    trigger?: React.ReactNode;
    content?: React.ReactNode;
    triggerProps?: Omit<React.ComponentPropsWithoutRef<typeof TabsTrigger>, "value">;
    contentProps?: Omit<React.ComponentPropsWithoutRef<typeof TabsContent>, "value">;
  }>;
};

const Tabs = TabsPrimitive.Root;

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn("inline-flex w-full items-center justify-center bg-transparent", className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "text-neutral-primary-alt border-neutral-secondary hover:text-brand-emphasis hover:border-brand-primary data-[state=active]: data-[state=active]:border-brand-primary data-[state=active]:text-brand-emphasis disabled:text-neutral-disabled disabled:border-neutral-disabled disabled flex-1 border-b px-4 py-2 data-[state=active]:border-b-2",

      className
    )}
    {...props}
  />
));
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none data-[state=inactive]:hidden!",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsContent, TabsList, TabsTrigger };
export type { TabsProps };
