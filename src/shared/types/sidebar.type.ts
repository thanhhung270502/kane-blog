import type { Icon } from "@phosphor-icons/react";

export type SidebarItem = {
  title: string;
  url: string;
  icon?: Icon;
  isActive?: boolean;
  items?: SidebarItem[];
};
