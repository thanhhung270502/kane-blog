import type { UserAddressRow, UserObject, UserRow } from "@common";
import type { EUserRole } from "@common";

import { query } from "@/libs/db";

export const UserRepository = {
  /**
   * Find a user by their email address.
   */
  async findByEmail(email: string): Promise<UserRow | null> {
    const result = await query<UserRow>(
      `SELECT id, email, password_hash, name, role, phone, google_sub, avatar_path FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [email]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Find a user by their ID.
   */
  async findById(userId: string): Promise<UserRow | null> {
    const result = await query<UserRow>(
      `SELECT id, email, password_hash, name, role, phone, google_sub, avatar_path FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Public user row for profile APIs (no email or auth secrets).
   */
  async findPublicById(userId: string): Promise<{
    id: string;
    name: string;
    role: string;
    avatar_path: string | null;
    created_at: string;
  } | null> {
    const result = await query<{
      id: string;
      name: string;
      role: string;
      avatar_path: string | null;
      created_at: string;
    }>(
      `SELECT id, name, role, avatar_path, created_at FROM users WHERE id = $1 AND deleted_at IS NULL`,
      [userId]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Find a user by their Google OAuth subject ID.
   */
  async findByGoogleSub(googleSub: string): Promise<UserRow | null> {
    const result = await query<UserRow>(
      `SELECT id, email, password_hash, name, role, phone, google_sub, avatar_path FROM users WHERE google_sub = $1 AND deleted_at IS NULL`,
      [googleSub]
    );
    return result.rows[0] ?? null;
  },

  /**
   * Insert a new user into the database.
   */
  async create(email: string, passwordHash: string, name: string): Promise<UserObject> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: string;
      phone?: string;
    }>(
      `INSERT INTO users (email, password_hash, name)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, role, phone`,
      [email, passwordHash, name]
    );
    const row = result.rows[0];
    return { ...row, role: row.role as EUserRole, avatarUrl: undefined, phone: undefined };
  },

  /**
   * Create a Google-only user (no password).
   */
  async createGoogleUser(email: string, name: string, googleSub: string): Promise<UserObject> {
    const result = await query<{
      id: string;
      email: string;
      name: string;
      role: string;
      phone: string | null;
    }>(
      `INSERT INTO users (email, name, google_sub)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, role, phone`,
      [email, name, googleSub]
    );
    const row = result.rows[0];
    return {
      ...row,
      role: row.role as EUserRole,
      avatarUrl: undefined,
      phone: undefined,
      bio: undefined,
      coverUrl: undefined,
      createdAt: new Date().toISOString(),
    };
  },

  /**
   * Link a Google sub to an existing user (for account linking).
   */
  async linkGoogleSub(userId: string, googleSub: string): Promise<void> {
    await query(`UPDATE users SET google_sub = $1, updated_at = NOW() WHERE id = $2`, [
      googleSub,
      userId,
    ]);
  },

  /**
   * Update the avatar S3 path for a user.
   */
  async updateAvatarPath(userId: string, avatarPath: string): Promise<void> {
    await query(`UPDATE users SET avatar_path = $1, updated_at = NOW() WHERE id = $2`, [
      avatarPath,
      userId,
    ]);
  },

  /**
   * Find the primary address for a user, falling back to any address if no primary is set.
   */
  async findPrimaryAddress(userId: string): Promise<UserAddressRow | null> {
    const result = await query<UserAddressRow>(
      `SELECT id, user_id, company_name, address, unit_or_suite, city, state, zip, country, is_primary
       FROM user_addresses
       WHERE user_id = $1
       ORDER BY is_primary DESC, created_at ASC
       LIMIT 1`,
      [userId]
    );
    return result.rows[0] ?? null;
  },
};
