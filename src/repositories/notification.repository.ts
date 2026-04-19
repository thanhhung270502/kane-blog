import type { NotificationRow } from "@common";

import { query } from "@/libs/db";

export const NotificationRepository = {
  async create(
    userId: string,
    actorId: string,
    type: string,
    entityId: string | null
  ): Promise<NotificationRow> {
    // Avoid duplicate notifications: same user/actor/type/entity within 1 hour
    const existing = await query<NotificationRow>(
      `SELECT id FROM notifications
       WHERE user_id = $1 AND actor_id = $2 AND type = $3
         AND ($4::uuid IS NULL OR entity_id = $4)
         AND created_at > NOW() - INTERVAL '1 hour'
       LIMIT 1`,
      [userId, actorId, type, entityId]
    );
    if (existing.rows[0]) {
      return existing.rows[0] as NotificationRow;
    }

    const result = await query<NotificationRow>(
      `INSERT INTO notifications (user_id, actor_id, type, entity_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, actorId, type, entityId]
    );
    return result.rows[0];
  },

  async getByUserId(
    userId: string,
    limit = 30,
    onlyUnread = false
  ): Promise<NotificationRow[]> {
    const result = await query<NotificationRow>(
      `SELECT * FROM notifications
       WHERE user_id = $1 ${onlyUnread ? "AND read_at IS NULL" : ""}
       ORDER BY created_at DESC
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows;
  },

  async countUnread(userId: string): Promise<number> {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM notifications WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );
    return parseInt(result.rows[0]?.count ?? "0", 10);
  },

  async markAsRead(id: string, userId: string): Promise<NotificationRow | null> {
    const result = await query<NotificationRow>(
      `UPDATE notifications SET read_at = NOW() WHERE id = $1 AND user_id = $2 RETURNING *`,
      [id, userId]
    );
    return result.rows[0] ?? null;
  },

  async markAllAsRead(userId: string): Promise<number> {
    const result = await query(
      `UPDATE notifications SET read_at = NOW() WHERE user_id = $1 AND read_at IS NULL`,
      [userId]
    );
    return result.rowCount ?? 0;
  },

  async findById(id: string): Promise<NotificationRow | null> {
    const result = await query<NotificationRow>(
      `SELECT * FROM notifications WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },
};
