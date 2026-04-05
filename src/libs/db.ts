import { Pool } from "@neondatabase/serverless";

import { logger } from "./logger";

let _pool: Pool | null = null;

/**
 * Get or create the Neon Postgres connection pool.
 * Lazily initialized to avoid errors during build when DATABASE_URL is not set.
 */
function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    try {
      _pool = new Pool({ connectionString });
    } catch (error) {
      logger.error("Failed to create Neon Postgres connection pool", { error });
      throw new Error("Failed to create Neon Postgres connection pool");
    }
  }
  return _pool;
}

/**
 * Execute a parameterized SQL query against the Neon Postgres database.
 * Uses connection pooling for efficient serverless usage.
 *
 * @example
 * const result = await query('SELECT * FROM auth_users WHERE email = $1', ['user@example.com']);
 */
export async function query<T = Record<string, unknown>>(text: string, params?: unknown[]) {
  const pool = getPool();
  const result = await pool.query(text, params);
  return result as { rows: T[]; rowCount: number | null };
}
