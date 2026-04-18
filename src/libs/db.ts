import { Pool as NeonPool } from "@neondatabase/serverless";
import { Pool as PgPool } from "pg";

import { logger } from "./logger";

type AnyPool = NeonPool | PgPool;

let _pool: AnyPool | null = null;

function getPool(): AnyPool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error("DATABASE_URL environment variable is not set");
    }
    try {
      if (process.env.NODE_ENV === "production") {
        _pool = new NeonPool({ connectionString });
      } else {
        _pool = new PgPool({
          user: process.env.DATABASE_USER,
          password: process.env.DATABASE_PASSWORD,
          host: process.env.DATABASE_HOST,
          port: parseInt(process.env.DATABASE_PORT ?? "5439"),
          database: process.env.DATABASE_NAME,
        });
      }
    } catch (error) {
      logger.error("Failed to create Postgres connection pool", { error });
      throw new Error("Failed to create Postgres connection pool");
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
