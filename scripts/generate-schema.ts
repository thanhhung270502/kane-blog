import { writeFileSync } from "fs";
import { resolve } from "path";

import { logger } from "@/libs/logger";

import { migrations } from "../src/libs/migrations-registry";

/**
 * Generates schema.sql from the migrations registry.
 * This file is for reference only — do NOT run it directly against the DB.
 * To apply changes, run: npm run db:sync
 */
const header = `-- ============================================
-- SweetPix App — Neon Postgres Schema
-- Auto-generated from src/libs/migrations-registry.ts
-- DO NOT EDIT MANUALLY. Run: npm run db:generate-schema
-- Generated at: ${new Date().toISOString()}
-- ============================================

`;

const body = migrations
  .map(({ name, sql }) => {
    const normalized = sql
      .split("\n")
      .map((line) => line.replace(/^ {6}/, "")) // strip leading 6-space indent from template literals
      .join("\n")
      .trim();

    return `-- [${name}]\n${normalized}`;
  })
  .join("\n\n");

const output = header + body + "\n";

const outPath = resolve(process.cwd(), "schema.sql");
writeFileSync(outPath, output, "utf-8");

logger.info(`✅ schema.sql generated (${migrations.length} migrations)`);
