import { FolderSimpleIcon } from "@phosphor-icons/react";

import { RouteKey } from "../enums";
import type { SidebarItem } from "../types";

import { PageTitles } from "./page-title.constant";
import { ClientRoutes } from "./routes.constant";

export const MainSidebar: SidebarItem[] = [
  {
    title: PageTitles[RouteKey.HOME],
    url: ClientRoutes[RouteKey.HOME],
    icon: FolderSimpleIcon,
  },
];
