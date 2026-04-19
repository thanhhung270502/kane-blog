import type {
  EFriendshipStatus,
  GetNotificationsResponse,
  MarkNotificationReadResponse,
  NotificationObject,
  NotificationRow,
  PostAuthorObject,
} from "@common";
import { ENotificationType } from "@common";

import { getDownloadUrl } from "@/libs/s3";
import { NotificationRepository } from "@/repositories/notification.repository";
import { PostRepository } from "@/repositories/post.repository";
import { UserRepository } from "@/repositories/user.repository";
import { FriendshipRepository } from "@/repositories/friendship.repository";

async function resolveAvatarUrl(path: string | null | undefined): Promise<string | null> {
  if (!path) return null;
  return getDownloadUrl(path);
}

async function buildNotificationObjects(
  rows: NotificationRow[]
): Promise<NotificationObject[]> {
  if (rows.length === 0) return [];

  const actorIds = [...new Set(rows.map((r) => r.actor_id))];
  const profiles = await PostRepository.findProfilesByUserIds(actorIds);
  const profilesMap = new Map(profiles.map((p) => [p.user_id, p]));

  return Promise.all(
    rows.map(async (row) => {
      const user = await UserRepository.findById(row.actor_id);
      const profile = profilesMap.get(row.actor_id);

      const actor: PostAuthorObject = {
        id: row.actor_id,
        name: user?.name ?? "Unknown",
        avatarUrl: await resolveAvatarUrl(profile?.avatar_path),
        username: profile?.username ?? null,
      };

      const obj: NotificationObject = {
        id: row.id,
        userId: row.user_id,
        actor,
        type: row.type as ENotificationType,
        entityId: row.entity_id,
        isRead: row.read_at !== null,
        createdAt: row.created_at,
      };

      // Attach friendship data so UI can render accept/reject buttons inline
      if (
        row.type === ENotificationType.FRIEND_REQUEST &&
        row.entity_id
      ) {
        const friendship = await FriendshipRepository.findById(row.entity_id);
        if (friendship) {
          obj.friendshipId = friendship.id;
          obj.friendshipStatus = friendship.status as EFriendshipStatus;
        }
      }

      return obj;
    })
  );
}

export const NotificationService = {
  /**
   * Create a notification. Silently ignores self-notifications.
   */
  async notify(
    userId: string,
    actorId: string,
    type: ENotificationType,
    entityId: string | null
  ): Promise<void> {
    if (userId === actorId) return;
    await NotificationRepository.create(userId, actorId, type, entityId);
  },

  async getNotifications(userId: string): Promise<GetNotificationsResponse> {
    const [rows, unreadCount] = await Promise.all([
      NotificationRepository.getByUserId(userId, 50),
      NotificationRepository.countUnread(userId),
    ]);
    const notifications = await buildNotificationObjects(rows);
    return { notifications, unreadCount };
  },

  async markAsRead(
    notificationId: string,
    userId: string
  ): Promise<MarkNotificationReadResponse> {
    const row = await NotificationRepository.markAsRead(notificationId, userId);
    if (!row) throw new Error("Notification not found");
    const [notification] = await buildNotificationObjects([row]);
    return { notification };
  },

  async markAllAsRead(userId: string): Promise<void> {
    await NotificationRepository.markAllAsRead(userId);
  },
};
