import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";

import { logger } from "@/libs/logger";

import "dotenv/config";

import { query } from "../src/libs/db";
import { migrations } from "../src/libs/migrations-registry";

// Polyfill WebSocket for standard Node.js environments
neonConfig.webSocketConstructor = ws;
/**
 * Standalone CLI script to sync the database schema.
 * Run via: npm run db:sync
 */
async function syncDatabase() {
  logger.info("🚀 Starting database synchronization...\n");

  try {
    for (const migration of migrations) {
      logger.info(`▶ Executing ${migration.name}...`);

      try {
        await query(migration.sql);
        logger.info(`✅ ${migration.name} — OK\n`);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        const stack = error instanceof Error ? error.stack : "";
        logger.error(`❌ ${migration.name} — FAILED\n   ${message}\n${stack}\n`);
        process.exit(1);
      }
    }

    logger.info("\n✨ Database synchronization completed successfully!");
    process.exit(0);
  } catch (error) {
    logger.error(`\n💥 Fatal error during synchronization: ${error}`);
    process.exit(1);
  }
}

syncDatabase();
