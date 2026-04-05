import type { FriendshipRow } from "@common";

import { query } from "@/libs/db";

export const FriendshipRepository = {
  /**
   * Find an existing friendship between two users (any direction).
   */
  async findBetween(userAId: string, userBId: string): Promise<FriendshipRow | null> {
    const result = await query<FriendshipRow>(
      `SELECT * FROM friendships
       WHERE (requester_id = $1 AND addressee_id = $2)
          OR (requester_id = $2 AND addressee_id = $1)`,
      [userAId, userBId]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Find a friendship by ID.
   */
  async findById(id: string): Promise<FriendshipRow | null> {
    const result = await query<FriendshipRow>(
      `SELECT * FROM friendships WHERE id = $1`,
      [id]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Create a new friend request.
   */
  async create(requesterId: string, addresseeId: string): Promise<FriendshipRow> {
    const result = await query<FriendshipRow>(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending')
       RETURNING *`,
      [requesterId, addresseeId]
    );
    return result.rows[0];
  },

  /**
   * Update the status of a friendship (accept / reject / block).
   */
  async updateStatus(id: string, status: string): Promise<FriendshipRow | null> {
    const result = await query<FriendshipRow>(
      `UPDATE friendships SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Delete (unfriend) a friendship by ID.
   */
  async deleteById(id: string): Promise<boolean> {
    const result = await query(`DELETE FROM friendships WHERE id = $1`, [id]);
    return (result.rowCount ?? 0) > 0;
  },

  /**
   * Get all pending requests where the user is the addressee.
   */
  async getPendingForAddressee(addresseeId: string): Promise<FriendshipRow[]> {
    const result = await query<FriendshipRow>(
      `SELECT * FROM friendships WHERE addressee_id = $1 AND status = 'pending' ORDER BY created_at DESC`,
      [addresseeId]
    );
    return result.rows;
  },

  /**
   * Get all accepted friendships for a user.
   */
  async getAcceptedFriends(userId: string): Promise<FriendshipRow[]> {
    const result = await query<FriendshipRow>(
      `SELECT * FROM friendships
       WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted'
       ORDER BY updated_at DESC`,
      [userId]
    );
    return result.rows;
  },

  /**
   * Get all accepted friend user IDs for a user.
   */
  async getFriendIds(userId: string): Promise<string[]> {
    const result = await query<{ friend_id: string }>(
      `SELECT CASE
         WHEN requester_id = $1 THEN addressee_id
         ELSE requester_id
       END AS friend_id
       FROM friendships
       WHERE (requester_id = $1 OR addressee_id = $1) AND status = 'accepted'`,
      [userId]
    );
    return result.rows.map((r) => r.friend_id);
  },
};
