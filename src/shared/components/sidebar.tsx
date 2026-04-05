"use client";

import type { ComponentProps, CSSProperties } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Icon } from "@phosphor-icons/react";
import { ArrowLeftIcon, ArrowRightIcon } from "@phosphor-icons/react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@tailwind-config/utils/cn";
import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import { useBetween, useSmaller } from "@/shared/hooks";

import type { Button } from "./button";
import { Separator } from "./separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "./sheet";
import { Skeleton } from "./skeleton";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip";

const SIDEBAR_COOKIE_NAME = "sidebar_state";
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = "14rem";
const SIDEBAR_WIDTH_MOBILE = "14rem";
const SIDEBAR_WIDTH_ICON = "4rem";
const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SIDEBAR_HEIGHT_BOTTOM = "4rem";

type SidebarContextProps = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  isTablet: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = createContext<SidebarContextProps | null>(null);

function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

function SidebarProvider({
  defaultOpen = true,
  open: openProp,
  onOpenChange: setOpenProp,
  className,
  style,
  children,
  ...props
}: ComponentProps<"div"> & {
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  const isMobile = useSmaller("sm");
  const isTablet = useBetween("sm", "lg");
  const [openMobile, setOpenMobile] = useState(false);

  // This is the internal state of the sidebar.
  // We use openProp and setOpenProp for control from outside the component.
  const [_open, _setOpen] = useState(defaultOpen);
  const open = openProp ?? _open;
  const setOpen = useCallback(
    (value: boolean | ((value: boolean) => boolean)) => {
      const openState = typeof value === "function" ? value(open) : value;
      if (setOpenProp) {
        setOpenProp(openState);
      } else {
        _setOpen(openState);
      }

      // This sets the cookie to keep the sidebar state.
      document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
    },
    [setOpenProp, open]
  );

  // Helper to toggle the sidebar.
  const toggleSidebar = useCallback(() => {
    return isMobile || isTablet ? setOpenMobile((open) => !open) : setOpen((open) => !open);
  }, [isMobile, isTablet, setOpen, setOpenMobile]);

  // Adds a keyboard shortcut to toggle the sidebar.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleSidebar]);

  // Handle case where the sidebar is open on tablet
  useEffect(() => {
    if (isTablet || isMobile) {
      setOpen(false);
    }
  }, [isTablet, isMobile, setOpen]);

  // We add a state so that we can do data-state="expanded" or "collapsed".
  // This makes it easier to style the sidebar with Tailwind classes.
  const state = open || openMobile ? "expanded" : "collapsed";

  const contextValue = useMemo<SidebarContextProps>(
    () => ({
      state,
      open,
      setOpen,
      isMobile,
      isTablet,
      openMobile,
      setOpenMobile,
      toggleSidebar,
    }),
    [state, open, setOpen, isMobile, isTablet, openMobile, setOpenMobile, toggleSidebar]
  );

  return (
    <SidebarContext.Provider value={contextValue}>
      <TooltipProvider delay={0}>
        <div
          data-slot="sidebar-wrapper"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH,
              "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
              "--sidebar-height-bottom": SIDEBAR_HEIGHT_BOTTOM,
              ...style,
            } as CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-dvh w-full",
            {
              "flex-col-reverse": isMobile,
              "overflow-hidden": !isMobile,
            },
            className
          )}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    </SidebarContext.Provider>
  );
}

function Sidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  side?: "left" | "right" | "bottom";
  variant?: "sidebar";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, isTablet, state, openMobile, setOpenMobile } = useSidebar();

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-brand-primary text-primary flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isTablet && openMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-tablet="true"
          showOverlay={false}
          className="bg-brand-primary text-primary px-md py-2xl w-(--sidebar-width) shadow-xl [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
          side="left"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar</SheetDescription>
          </SheetHeader>
          <div className="gap-2xl flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div
      className={cn("group peer bg-brand-primary block", {
        "h-(--sidebar-height-bottom)": isMobile,
      })}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "transition-[left,right,bottom,width, height] fixed z-10 h-dvh duration-200 ease-linear md:flex",
          side === "left"
            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : side === "right"
              ? "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]"
              : "bottom-0 group-data-[collapsible=offcanvas]:bottom-[calc(var(--sidebar-height-bottom)*-1)]",
          side === "bottom"
            ? "bg-brand-primary h-(--sidebar-height-bottom) w-full"
            : "inset-y-0 w-(--sidebar-width) group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn("flex h-full w-full flex-col", {
            "px-xl py-2xl gap-2xl group-data-[collapsible=icon]:px-2": !isMobile,
            "py-md px-2xl gap-xxs": isMobile,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

type SidebarTriggerProps = ComponentProps<typeof Button> & {
  iconClassName?: string;
};

function SidebarTrigger({ className, onClick, iconClassName, ...props }: SidebarTriggerProps) {
  const { toggleSidebar, state } = useSidebar();
  const Icon = state === "collapsed" ? ArrowRightIcon : ArrowLeftIcon;

  return (
    <button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      className={cn("cursor-pointer rounded-full bg-white p-[3px]", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <Icon className={cn("text-brand-quaternary", iconClassName)} size={22} />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  );
}

function SidebarRail({ className, ...props }: ComponentProps<"button">) {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      data-sidebar="rail"
      data-slot="sidebar-rail"
      aria-label="Toggle Sidebar"
      tabIndex={-1}
      onClick={toggleSidebar}
      title="Toggle Sidebar"
      className={cn(
        "hover:after:bg-brand-secondary-hover absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex",
        "in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize",
        "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize",
        "hover:group-data-[collapsible=offcanvas]:bg-brand-secondary-hover group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full",
        "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2",
        "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",
        className
      )}
      {...props}
    />
  );
}

function SidebarInset({ className, ...props }: ComponentProps<"main">) {
  const { isMobile } = useSidebar();
  return (
    <main
      data-slot="sidebar-inset"
      className={cn(
        "relative flex h-dvh w-full flex-1 flex-col bg-white",
        {
          "overflow-visible": isMobile,
          "overflow-y-hidden": !isMobile,
        },
        className
      )}
      {...props}
    />
  );
}

function SidebarHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-header"
      data-sidebar="header"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-footer"
      data-sidebar="footer"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function SidebarSeparator({ className, ...props }: ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="sidebar-separator"
      data-sidebar="separator"
      className={cn("bg-tertiary mx-2 w-auto", className)}
      {...props}
    />
  );
}

function SidebarContent({ className, ...props }: ComponentProps<"div">) {
  const { isMobile } = useSidebar();

  return (
    <div
      data-slot="sidebar-content"
      data-sidebar="content"
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-x-hidden overflow-y-auto group-data-[collapsible=icon]:overflow-hidden",
        {
          "flex-row": isMobile,
        },
        className
      )}
      {...props}
    />
  );
}

function SidebarGroup({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group"
      data-sidebar="group"
      className={cn("relative flex w-full min-w-0 flex-col", className)}
      {...props}
    />
  );
}

function SidebarGroupLabel({
  className,
  asChild = false,
  ...props
}: ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "div";

  return (
    <Comp
      data-slot="sidebar-group-label"
      data-sidebar="group-label"
      className={cn(
        "text-primary flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium outline-hidden transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupAction({
  className,
  asChild = false,
  ...props
}: ComponentProps<"button"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="sidebar-group-action"
      data-sidebar="group-action"
      className={cn(
        "text-primary hover:bg-brand-secondary-hover hover:text-primary absolute top-3.5 right-3 flex aspect-square w-5 items-center justify-center rounded-md p-0 outline-hidden transition-transform focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
        // Increases the hit area of the button on mobile.
        "after:absolute after:-inset-2 md:after:hidden",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

function SidebarGroupContent({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="sidebar-group-content"
      data-sidebar="group-content"
      className={cn("body-sm w-full", className)}
      {...props}
    />
  );
}

function SidebarMenu({ className, ...props }: ComponentProps<"ul">) {
  const { isMobile } = useSidebar();

  return (
    <ul
      data-slot="sidebar-menu"
      data-sidebar="menu"
      className={cn(
        "gap-xxs flex w-full min-w-0 flex-col",
        {
          "flex-row justify-between": isMobile,
        },
        className
      )}
      {...props}
    />
  );
}

function SidebarMenuItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-item"
      data-sidebar="menu-item"
      className={cn("group/menu-item relative", className)}
      {...props}
    />
  );
}

const sidebarMenuButtonVariants = cva(
  [
    "peer/menu-button group flex w-full items-center gap-lg overflow-hidden rounded-md text-left font-medium outline-hidden transition-[width,height,padding] focus-visible:ring-2 disabled:pointer-events-none group-has-data-[sidebar=menu-action]/menu-item:pr-8 aria-disabled:pointer-events-none [&>span:last-child]:truncate cursor-pointer",
  ],
  {
    variants: {
      variant: {
        default: [
          "text-primary hover:text-primary active:text-primary data-[active=true]:text-primary",
          "bg-transparent hover:bg-brand-secondary-hover active:bg-brand-secondary data-[active=true]:bg-brand-secondary",
          "disabled:text-disabled",
          "group-data-[collapsible=icon]:justify-center",
        ],
      },
      size: {
        default: "group-data-[collapsible=icon]:size-12 body-md px-lg py-md",
      },
      isMobile: {
        true: "h-auto group-data-[collapsible=icon]:px-0 justify-center items-center",
        false: "group-data-[collapsible=icon]:px-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function SidebarMenuButton({
  asChild = false,
  isActive = false,
  variant = "default",
  size = "default",
  tooltip,
  className,
  ...props
}: ComponentProps<"button"> & {
  asChild?: boolean;
  isActive?: boolean;
  tooltip?: string | ComponentProps<typeof TooltipContent>;
} & VariantProps<typeof sidebarMenuButtonVariants>) {
  const Comp = asChild ? Slot : "button";
  const { isMobile, state } = useSidebar();

  const button = (
    <Comp
      data-slot="sidebar-menu-button"
      data-sidebar="menu-button"
      data-size={size}
      data-active={isActive}
      className={cn(sidebarMenuButtonVariants({ variant, size, isMobile }), className)}
      {...props}
    />
  );

  if (!tooltip) {
    return button;
  }

  if (typeof tooltip === "string") {
    tooltip = {
      children: tooltip,
    };
  }

  return (
    <Tooltip>
      <TooltipTrigger render={button} />
      <TooltipContent
        side="top"
        align="center"
        variant="dark"
        hidden={state !== "collapsed" || isMobile}
        showArrow
        {...tooltip}
      />
    </Tooltip>
  );
}

function SidebarMenuIcon({
  className,
  icon: ItemIcon,
  ...props
}: ComponentProps<"div"> & { icon: Icon }) {
  return (
    <div
      data-slot="sidebar-menu-button-icon"
      data-sidebar="menu-button-icon"
      className={cn(
        "border-secondary p-md text-tertiary group-data-[active=true]:text-brand-tertiary flex size-8 items-center justify-center rounded-4xl border bg-white group-data-[collapsible=icon]:size-8",
        className
      )}
      {...props}
    >
      <ItemIcon size={16} />
    </div>
  );
}

function SidebarMenuSkeleton({
  className,
  showIcon = false,
  ...props
}: ComponentProps<"div"> & {
  showIcon?: boolean;
}) {
  // Random width between 50 to 90%.
  const width = useMemo(() => {
    // eslint-disable-next-line react-hooks/purity
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      data-slot="sidebar-menu-skeleton"
      data-sidebar="menu-skeleton"
      className={cn("flex h-8 items-center gap-2 rounded-md px-2", className)}
      {...props}
    >
      {showIcon && <Skeleton className="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />}
      <Skeleton
        className="h-4 max-w-(--skeleton-width) flex-1"
        data-sidebar="menu-skeleton-text"
        style={{ "--skeleton-width": width } as CSSProperties}
      />
    </div>
  );
}

function SidebarMenuSub({ className, ...props }: ComponentProps<"ul">) {
  return (
    <ul
      data-slot="sidebar-menu-sub"
      data-sidebar="menu-sub"
      className={cn(
        "border-secondary ml-[26px] flex min-w-0 translate-x-px flex-col border-l",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

function SidebarMenuSubItem({ className, ...props }: ComponentProps<"li">) {
  return (
    <li
      data-slot="sidebar-menu-sub-item"
      data-sidebar="menu-sub-item"
      className={cn("group/menu-sub-item relative", className)}
      {...props}
    />
  );
}

function SidebarMenuSubButton({
  isActive = false,
  className,
  ...props
}: ComponentProps<"span"> & {
  isActive?: boolean;
}) {
  return (
    <span
      data-slot="sidebar-menu-sub-button"
      data-sidebar="menu-sub-button"
      data-active={isActive}
      className={cn(
        "body-md text-primary hover:text-primary active:text-brand-tertiary pr-xl py-md flex h-9 min-w-0 -translate-x-px items-center overflow-hidden pl-6 font-medium outline-hidden focus-visible:ring-2 disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50",
        "border-brand-subtle data-[active=true]:border-brand border-l",
        "data-[active=true]:text-brand-tertiary",
        "group-data-[collapsible=icon]:hidden",
        className
      )}
      {...props}
    />
  );
}

function SecondarySidebar({
  side = "left",
  variant = "sidebar",
  collapsible = "offcanvas",
  className,
  children,
  ...props
}: ComponentProps<"div"> & {
  side?: "left" | "right" | "bottom";
  variant?: "sidebar";
  collapsible?: "offcanvas" | "icon" | "none";
}) {
  const { isMobile, isTablet, state, openMobile, setOpenMobile } = useSidebar();
  const isNotDesktop = isMobile || isTablet;

  if (collapsible === "none") {
    return (
      <div
        data-slot="sidebar"
        className={cn(
          "bg-brand-primary text-primary flex h-full w-(--sidebar-width) flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (isNotDesktop && openMobile) {
    return (
      <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
        <SheetContent
          data-sidebar="sidebar"
          data-slot="sidebar"
          data-tablet="true"
          showOverlay={false}
          className="bg-brand-primary text-primary w-(--sidebar-width) shadow-xl [&>button]:hidden"
          style={
            {
              "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
            } as CSSProperties
          }
          side="left"
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Displays the mobile sidebar</SheetDescription>
          </SheetHeader>
          <div className="gap-2xl flex h-full w-full flex-col">{children}</div>
        </SheetContent>
      </Sheet>
    );
  }

  if (isNotDesktop && !openMobile) {
    return (
      <div className="fixed bottom-20 left-4 z-10">
        <SidebarTrigger className="bg-brand-main p-sm" iconClassName="text-white" />
      </div>
    );
  }

  return (
    <div
      className={cn("group peer bg-brand-primary relative block", {
        "h-(--sidebar-height-bottom)": isMobile,
      })}
      data-state={state}
      data-collapsible={state === "collapsed" ? collapsible : ""}
      data-variant={variant}
      data-side={side}
      data-slot="sidebar"
    >
      {/* This is what handles the sidebar gap on desktop */}
      <div
        data-slot="sidebar-gap"
        className={cn(
          "relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
          "group-data-[collapsible=offcanvas]:w-0",
          "group-data-[side=right]:rotate-180",
          "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
        )}
      />
      <div
        data-slot="sidebar-container"
        className={cn(
          "transition-[left,right,bottom,width, height] fixed z-10 h-dvh duration-200 ease-linear md:flex",
          side === "left"
            ? "border-brand-subtle left-(--sidebar-width-icon) border-l group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
            : side === "right"
              ? "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]"
              : "bottom-(--sidebar-height-bottom) group-data-[collapsible=offcanvas]:bottom-[calc(var(--sidebar-height-bottom)*-1)]",
          side === "bottom"
            ? "bg-brand-primary h-(--sidebar-height-bottom) w-full"
            : "inset-y-0 w-(--sidebar-width) group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=right]:border-l",
          className
        )}
        {...props}
      >
        <div
          data-sidebar="sidebar"
          data-slot="sidebar-inner"
          className={cn("flex h-full w-full flex-col", {
            "gap-2xl": !isMobile,
            "gap-xxs": isMobile,
          })}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export {
  SecondarySidebar,
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuIcon,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
