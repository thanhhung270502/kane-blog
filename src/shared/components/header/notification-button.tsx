"use client";

import { useState } from "react";
import type { NotificationObject } from "@common";
import { EFriendshipStatus, ENotificationType } from "@common";
import {
  BellIcon,
  ChatCircleIcon,
  CheckIcon,
  HeartIcon,
  ShareNetworkIcon,
  UserPlusIcon,
} from "@phosphor-icons/react";
import { cn } from "@tailwind-config/utils/cn";

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} giờ trước`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} tuần trước`;
  return `${Math.floor(days / 30)} tháng trước`;
}

import {
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
  useQueryMe,
  useQueryNotifications,
  useRespondFriendRequestMutation,
} from "@/shared/hooks";

import { Button } from "../button";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Separator } from "../separator";
import { Typography } from "../typography";
import { UserAvatar } from "../user-avatar";

// ─── Notification icon by type ────────────────────────────────────────────────

function NotificationTypeIcon({ type }: { type: ENotificationType }) {
  const base = "flex items-center justify-center rounded-full w-5 h-5";
  if (type === ENotificationType.FRIEND_REQUEST || type === ENotificationType.FRIEND_ACCEPTED) {
    return (
      <span className={cn(base, "bg-blue-500")}>
        <UserPlusIcon size={12} weight="fill" className="text-white" />
      </span>
    );
  }
  if (type === ENotificationType.POST_REACTION) {
    return (
      <span className={cn(base, "bg-red-500")}>
        <HeartIcon size={12} weight="fill" className="text-white" />
      </span>
    );
  }
  if (type === ENotificationType.POST_COMMENT) {
    return (
      <span className={cn(base, "bg-green-500")}>
        <ChatCircleIcon size={12} weight="fill" className="text-white" />
      </span>
    );
  }
  if (type === ENotificationType.POST_SHARE) {
    return (
      <span className={cn(base, "bg-purple-500")}>
        <ShareNetworkIcon size={12} weight="fill" className="text-white" />
      </span>
    );
  }
  return null;
}

// ─── Notification text ────────────────────────────────────────────────────────

function notificationText(n: NotificationObject): string {
  const name = n.actor.name;
  switch (n.type) {
    case ENotificationType.FRIEND_REQUEST:
      return `${name} sent you a friend request.`;
    case ENotificationType.FRIEND_ACCEPTED:
      return `${name} accepted your friend request.`;
    case ENotificationType.POST_REACTION:
      return `${name} liked your post.`;
    case ENotificationType.POST_COMMENT:
      return `${name} commented on your post.`;
    case ENotificationType.POST_SHARE:
      return `${name} shared your post.`;
    default:
      return `${name} interacted with you.`;
  }
}

// ─── Single notification item ─────────────────────────────────────────────────

function NotificationItem({
  notification,
  onRead,
}: {
  notification: NotificationObject;
  onRead: (id: string) => void;
}) {
  const { mutate: respond, isPending } = useRespondFriendRequestMutation();

  const isPendingRequest =
    notification.type === ENotificationType.FRIEND_REQUEST &&
    notification.friendshipStatus === EFriendshipStatus.PENDING &&
    notification.friendshipId;

  const handleAccept = () => {
    if (!notification.friendshipId) return;
    respond({ id: notification.friendshipId, data: { status: EFriendshipStatus.ACCEPTED } });
    onRead(notification.id);
  };

  const handleDecline = () => {
    if (!notification.friendshipId) return;
    respond({ id: notification.friendshipId, data: { status: EFriendshipStatus.REJECTED } });
    onRead(notification.id);
  };

  return (
    <div
      className={cn(
        "hover:bg-black-quaternary relative flex cursor-pointer gap-3 rounded-lg px-3 py-3 transition-colors",
        !notification.isRead && "bg-blue-500/5"
      )}
      onClick={() => !notification.isRead && onRead(notification.id)}
    >
      {/* Avatar + type badge */}
      <div className="relative h-fit shrink-0">
        <UserAvatar
          name={notification.actor.name}
          avatarUrl={notification.actor.avatarUrl ?? undefined}
          size="md"
        />
        <span className="absolute -right-1 -bottom-1">
          <NotificationTypeIcon type={notification.type} />
        </span>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Typography variant="body-sm" as="p">
          <span className="font-semibold">{notification.actor.name}</span>{" "}
          <span className="text-white-secondary">
            {notificationText(notification).replace(notification.actor.name, "").trim()}
          </span>
        </Typography>

        <Typography variant="body-xs" color="secondary">
          {timeAgo(notification.createdAt)}
        </Typography>

        {/* Friend request action buttons */}
        {isPendingRequest && (
          <div className="mt-1 flex gap-2">
            <Button
              variant="primary"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                handleAccept();
              }}
              loading={isPending}
            >
              Chấp nhận
            </Button>
            <Button
              variant="gray"
              size="xs"
              onClick={(e) => {
                e.stopPropagation();
                handleDecline();
              }}
              loading={isPending}
            >
              Từ chối
            </Button>
          </div>
        )}
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="mt-2 h-2.5 w-2.5 shrink-0 self-start rounded-full bg-blue-500" />
      )}
    </div>
  );
}

// ─── Main notification button ─────────────────────────────────────────────────

export function NotificationButton() {
  const { data: user } = useQueryMe();
  const [tab, setTab] = useState<"all" | "unread">("all");

  const { data, isLoading } = useQueryNotifications({ enabled: !!user });
  const { mutate: markRead } = useMarkNotificationReadMutation();
  const { mutate: markAllRead, isPending: isMarkingAll } = useMarkAllNotificationsReadMutation();

  if (!user) return null;

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;
  const displayed = tab === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="no-outlined-primary" size="md" className="relative rounded-full!">
            <BellIcon size={22} weight={unreadCount > 0 ? "fill" : "regular"} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
          </Button>
        }
      />

      <PopoverContent
        side="bottom"
        align="end"
        sideOffset={8}
        popupClassName={cn(
          "bg-black-secondary border-black-quaternary flex flex-col rounded-xl border shadow-2xl",
          "w-[380px]"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <Typography variant="body-xl" weight="bold">
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              variant="text-white-primary"
              size="xs"
              startIcon={<CheckIcon size={14} />}
              onClick={() => markAllRead()}
              loading={isMarkingAll}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-3 pb-2">
          <Button
            variant={tab === "all" ? "black-tertiary" : "no-outlined-white-secondary"}
            onClick={() => setTab("all")}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors")}
          >
            Tất cả
          </Button>
          <Button
            variant={tab === "unread" ? "black-tertiary" : "no-outlined-white-secondary"}
            onClick={() => setTab("unread")}
            className={cn("rounded-full px-4 py-1.5 text-sm font-medium transition-colors")}
          >
            Chưa đọc
            {unreadCount > 0 && (
              <span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] text-white">
                {unreadCount}
              </span>
            )}
          </Button>
        </div>

        <Separator />

        {/* Notification list */}
        <div className="max-h-[480px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col gap-1 p-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-3 rounded-lg px-3 py-3">
                  <div className="bg-black-quaternary h-10 w-10 animate-pulse rounded-full" />
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="bg-black-quaternary h-3 w-3/4 animate-pulse rounded" />
                    <div className="bg-black-quaternary h-2.5 w-1/3 animate-pulse rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
              <BellIcon size={36} className="text-white-tertiary mb-2" />
              <Typography variant="body-md" color="secondary">
                {tab === "unread" ? "Không có thông báo chưa đọc" : "Chưa có thông báo nào"}
              </Typography>
            </div>
          ) : (
            <div className="p-2">
              {displayed.length > 0 && (
                <>
                  <div className="mb-1 flex items-center justify-between px-2">
                    <Typography variant="body-sm" weight="semibold" color="secondary">
                      Trước đó
                    </Typography>
                  </div>
                  {displayed.map((n) => (
                    <NotificationItem key={n.id} notification={n} onRead={markRead} />
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
