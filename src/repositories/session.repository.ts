import type { EUserRole, UserObject } from "@common";

import { query } from "@/libs/db";
import { getDownloadUrl } from "@/libs/s3";

export type SessionRow = {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  created_at: Date;
};

export const SessionRepository = {
  /**
   * Insert a new session token for a user.
   */
  async create(userId: string, token: string, expiresAt: Date): Promise<void> {
    await query(`INSERT INTO user_sessions (user_id, token, expires_at) VALUES ($1, $2, $3)`, [
      userId,
      token,
      expiresAt.toISOString(),
    ]);
  },

  /**
   * Find a valid (non-expired) session by its token, joining with the user.
   */
  async findValidSessionWithUser(token: string): Promise<UserObject | null> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: string;
      phone: string | null;
      avatar_path: string | null;
    }>(
      `SELECT u.id, u.email, u.name, u.role, u.phone, u.avatar_path
       FROM user_sessions s
       JOIN users u ON u.id = s.user_id
       WHERE s.token = $1 AND s.expires_at > NOW() AND u.deleted_at IS NULL`,
      [token]
    );
    const row = result.rows[0];
    if (!row) return null;

    return {
      id: row.id,
      email: row.email,
      name: row.name,
      role: row.role as EUserRole,
      phone: row.phone ?? undefined,
      avatarUrl: row.avatar_path ? await getDownloadUrl(row.avatar_path) : undefined,
    };
  },

  /**
   * Delete a session by its token.
   */
  async deleteByToken(token: string): Promise<void> {
    await query(`DELETE FROM user_sessions WHERE token = $1`, [token]);
  },

  /**
   * Update a session's expiration date if it is still valid.
   * Returns true if updated, false if not found or expired.
   */
  async updateExpiration(token: string, newExpiresAt: Date): Promise<boolean> {
    const result = await query(
      `UPDATE user_sessions
       SET expires_at = $1
       WHERE token = $2 AND expires_at > NOW()
       RETURNING id`,
      [newExpiresAt.toISOString(), token]
    );
    return (result.rowCount ?? 0) > 0;
  },
};
