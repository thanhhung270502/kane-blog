import type {
  PostAttachmentRow,
  PostCommentRow,
  PostReactionRow,
  PostRow,
  PostShareRow,
  UserProfileRow,
} from "@common";

import { query } from "@/libs/db";

export const PostRepository = {
  // ─── Feed ─────────────────────────────────────────────────────────────────

  /**
   * Get paginated feed for a user (own posts + friends' posts).
   */
  async getFeed(
    userId: string,
    limit: number,
    cursor: string | null
  ): Promise<PostRow[]> {
    const cursorClause = cursor ? `AND p.created_at < $3` : "";
    const params: (string | number)[] = cursor ? [userId, limit, cursor] : [userId, limit];

    const result = await query<PostRow>(
      `SELECT p.*
       FROM posts p
       WHERE p.deleted_at IS NULL
         AND (
           p.author_id = $1
           OR p.author_id IN (
             SELECT CASE
               WHEN f.requester_id = $1 THEN f.addressee_id
               ELSE f.requester_id
             END
             FROM friendships f
             WHERE (f.requester_id = $1 OR f.addressee_id = $1)
               AND f.status = 'accepted'
           )
         )
         ${cursorClause}
       ORDER BY p.created_at DESC
       LIMIT $2`,
      params
    );
    return result.rows;
  },

  /**
   * Get posts by a specific author (for profile page).
   */
  async getByAuthor(
    authorId: string,
    viewerId: string,
    limit: number,
    cursor: string | null
  ): Promise<PostRow[]> {
    const isFriendSubquery = `
      EXISTS (
        SELECT 1 FROM friendships f
        WHERE ((f.requester_id = $2 AND f.addressee_id = $1)
            OR (f.requester_id = $1 AND f.addressee_id = $2))
          AND f.status = 'accepted'
      )
    `;
    const cursorClause = cursor ? `AND p.created_at < $4` : "";
    const params: (string | number)[] = cursor
      ? [authorId, viewerId, limit, cursor]
      : [authorId, viewerId, limit];

    const result = await query<PostRow>(
      `SELECT p.*
       FROM posts p
       WHERE p.author_id = $1
         AND p.deleted_at IS NULL
         AND (p.visibility = 'public' OR ($1 = $2) OR (p.visibility = 'friends' AND ${isFriendSubquery}))
         ${cursorClause}
       ORDER BY p.created_at DESC
       LIMIT $3`,
      params
    );
    return result.rows;
  },

  /**
   * Find a single post by ID.
   */
  async findById(postId: string): Promise<PostRow | null> {
    const result = await query<PostRow>(
      `SELECT * FROM posts WHERE id = $1 AND deleted_at IS NULL`,
      [postId]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Create a new post.
   */
  async create(
    authorId: string,
    body: string | null,
    visibility: string,
    sharedPostId: string | null
  ): Promise<PostRow> {
    const result = await query<PostRow>(
      `INSERT INTO posts (author_id, body, visibility, shared_post_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [authorId, body, visibility, sharedPostId]
    );
    return result.rows[0];
  },

  /**
   * Soft-delete a post.
   */
  async softDelete(postId: string, authorId: string): Promise<boolean> {
    const result = await query(
      `UPDATE posts SET deleted_at = NOW() WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
      [postId, authorId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // ─── Attachments ──────────────────────────────────────────────────────────

  async createAttachments(
    postId: string,
    attachments: Array<{ url: string; s3Key?: string; kind?: string; sortOrder?: number }>
  ): Promise<PostAttachmentRow[]> {
    if (attachments.length === 0) return [];

    const values = attachments
      .map((_, i) => `($1, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}, $${i * 4 + 5})`)
      .join(", ");

    const params: (string | number | null)[] = [postId];
    for (const a of attachments) {
      params.push(a.url, a.s3Key ?? null, a.kind ?? "image", a.sortOrder ?? 0);
    }

    const result = await query<PostAttachmentRow>(
      `INSERT INTO post_attachments (post_id, url, s3_key, kind, sort_order) VALUES ${values} RETURNING *`,
      params
    );
    return result.rows;
  },

  async getAttachments(postId: string): Promise<PostAttachmentRow[]> {
    const result = await query<PostAttachmentRow>(
      `SELECT * FROM post_attachments WHERE post_id = $1 ORDER BY sort_order ASC`,
      [postId]
    );
    return result.rows;
  },

  async getAttachmentsByPostIds(postIds: string[]): Promise<PostAttachmentRow[]> {
    if (postIds.length === 0) return [];
    const result = await query<PostAttachmentRow>(
      `SELECT * FROM post_attachments WHERE post_id = ANY($1::uuid[]) ORDER BY sort_order ASC`,
      [postIds]
    );
    return result.rows;
  },

  // ─── Reactions ────────────────────────────────────────────────────────────

  async getReactionCounts(postIds: string[]): Promise<{ post_id: string; count: string }[]> {
    if (postIds.length === 0) return [];
    const result = await query<{ post_id: string; count: string }>(
      `SELECT post_id, COUNT(*)::text as count FROM post_reactions WHERE post_id = ANY($1::uuid[]) GROUP BY post_id`,
      [postIds]
    );
    return result.rows;
  },

  async getUserReactions(
    postIds: string[],
    userId: string
  ): Promise<PostReactionRow[]> {
    if (postIds.length === 0) return [];
    const result = await query<PostReactionRow>(
      `SELECT * FROM post_reactions WHERE post_id = ANY($1::uuid[]) AND user_id = $2`,
      [postIds, userId]
    );
    return result.rows;
  },

  async findReaction(postId: string, userId: string): Promise<PostReactionRow | null> {
    const result = await query<PostReactionRow>(
      `SELECT * FROM post_reactions WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    return result.rows[0] ?? null;
  },

  async addReaction(postId: string, userId: string, type: string): Promise<PostReactionRow> {
    const result = await query<PostReactionRow>(
      `INSERT INTO post_reactions (post_id, user_id, type) VALUES ($1, $2, $3) RETURNING *`,
      [postId, userId, type]
    );
    return result.rows[0];
  },

  async removeReaction(postId: string, userId: string): Promise<boolean> {
    const result = await query(
      `DELETE FROM post_reactions WHERE post_id = $1 AND user_id = $2`,
      [postId, userId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  async countReactions(postId: string): Promise<number> {
    const result = await query<{ count: string }>(
      `SELECT COUNT(*)::text as count FROM post_reactions WHERE post_id = $1`,
      [postId]
    );
    return parseInt(result.rows[0]?.count ?? "0", 10);
  },

  // ─── Comments ─────────────────────────────────────────────────────────────

  async getComments(
    postId: string,
    limit: number,
    cursor: string | null
  ): Promise<PostCommentRow[]> {
    const cursorClause = cursor ? `AND c.created_at > $3` : "";
    const params: (string | number)[] = cursor ? [postId, limit, cursor] : [postId, limit];

    const result = await query<PostCommentRow>(
      `SELECT c.*
       FROM post_comments c
       WHERE c.post_id = $1 AND c.deleted_at IS NULL AND c.parent_id IS NULL
         ${cursorClause}
       ORDER BY c.created_at ASC
       LIMIT $2`,
      params
    );
    return result.rows;
  },

  async getCommentCounts(postIds: string[]): Promise<{ post_id: string; count: string }[]> {
    if (postIds.length === 0) return [];
    const result = await query<{ post_id: string; count: string }>(
      `SELECT post_id, COUNT(*)::text as count FROM post_comments WHERE post_id = ANY($1::uuid[]) AND deleted_at IS NULL GROUP BY post_id`,
      [postIds]
    );
    return result.rows;
  },

  async createComment(
    postId: string,
    authorId: string,
    body: string,
    parentId: string | null
  ): Promise<PostCommentRow> {
    const result = await query<PostCommentRow>(
      `INSERT INTO post_comments (post_id, author_id, body, parent_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [postId, authorId, body, parentId]
    );
    return result.rows[0];
  },

  async softDeleteComment(commentId: string, authorId: string): Promise<boolean> {
    const result = await query(
      `UPDATE post_comments SET deleted_at = NOW() WHERE id = $1 AND author_id = $2 AND deleted_at IS NULL`,
      [commentId, authorId]
    );
    return (result.rowCount ?? 0) > 0;
  },

  // ─── Shares ───────────────────────────────────────────────────────────────

  async getShareCounts(postIds: string[]): Promise<{ post_id: string; count: string }[]> {
    if (postIds.length === 0) return [];
    const result = await query<{ post_id: string; count: string }>(
      `SELECT post_id, COUNT(*)::text as count FROM post_shares WHERE post_id = ANY($1::uuid[]) GROUP BY post_id`,
      [postIds]
    );
    return result.rows;
  },

  async recordShare(postId: string, userId: string): Promise<PostShareRow> {
    const result = await query<PostShareRow>(
      `INSERT INTO post_shares (post_id, user_id) VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING *`,
      [postId, userId]
    );
    return result.rows[0];
  },

  // ─── User Profiles ────────────────────────────────────────────────────────

  async findProfile(userId: string): Promise<UserProfileRow | null> {
    const result = await query<UserProfileRow>(
      `SELECT * FROM user_profiles WHERE user_id = $1`,
      [userId]
    );
    return result.rows[0] ?? null;
  },

  async upsertProfile(
    userId: string,
    data: { username?: string; bio?: string; avatarPath?: string; coverPath?: string }
  ): Promise<UserProfileRow> {
    const result = await query<UserProfileRow>(
      `INSERT INTO user_profiles (user_id, username, bio, avatar_path, cover_path)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (user_id) DO UPDATE
         SET username    = COALESCE(EXCLUDED.username, user_profiles.username),
             bio         = COALESCE(EXCLUDED.bio, user_profiles.bio),
             avatar_path = COALESCE(EXCLUDED.avatar_path, user_profiles.avatar_path),
             cover_path  = COALESCE(EXCLUDED.cover_path, user_profiles.cover_path),
             updated_at  = NOW()
       RETURNING *`,
      [userId, data.username ?? null, data.bio ?? null, data.avatarPath ?? null, data.coverPath ?? null]
    );
    return result.rows[0];
  },

  async findProfilesByUserIds(userIds: string[]): Promise<UserProfileRow[]> {
    if (userIds.length === 0) return [];
    const result = await query<UserProfileRow>(
      `SELECT * FROM user_profiles WHERE user_id = ANY($1::uuid[])`,
      [userIds]
    );
    return result.rows;
  },
};
