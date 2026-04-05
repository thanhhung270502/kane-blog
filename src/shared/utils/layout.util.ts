import { SearchParams } from "../enums";
import type { SidebarItem } from "../types";

export const checkActiveItem = (item: SidebarItem, pathname: string, view?: string | null) => {
  const haveChildren = item.items && item.items.length > 0;
  if (view) {
    return (item.items ?? []).some(
      (child) => child.url === `${pathname}?${SearchParams.View}=${view}`
    );
  }
  return haveChildren
    ? (item.items ?? []).some((child) => pathname.startsWith(child.url))
    : pathname.startsWith(item.url);
};
