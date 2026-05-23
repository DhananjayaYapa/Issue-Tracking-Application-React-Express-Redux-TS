/**
 * Idempotent database seed.
 * Safe to run multiple times — uses ON DUPLICATE KEY UPDATE for all rows.
 *
 * Usage:
 *   npm run seed
 *
 * Environment variables read:
 *   DATABASE_URL   — required
 *   ADMIN_NAME     — admin display name     (default: Admin)
 *   ADMIN_EMAIL    — admin account email    (default: admin@issuetracker.com)
 *   ADMIN_PASSWORD — admin initial password (default: Admin@123)
 */

import "dotenv/config";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { db, pool } from "../src/config/db.js";
import logger from "../src/config/logger.js";
import {
  issueStatuses,
  issuePriorities,
  issues,
  users,
} from "../src/db/schema.js";

// ─── Constants ───────────────────────────────────────────────────────────────

const SALT_ROUNDS = 10;

// ─── Seed Data ───────────────────────────────────────────────────────────────

const STATUSES = [
  { id: 1, name: "Open", displayOrder: 1, isTerminal: false },
  { id: 2, name: "In Progress", displayOrder: 2, isTerminal: false },
  { id: 3, name: "Resolved", displayOrder: 3, isTerminal: true },
  { id: 4, name: "Closed", displayOrder: 4, isTerminal: true },
] as const;

const PRIORITIES = [
  { id: 1, name: "Low", level: 1 },
  { id: 2, name: "Medium", level: 2 },
  { id: 3, name: "High", level: 3 },
  { id: 4, name: "Critical", level: 4 },
] as const;

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  logger.info("Starting database seed...");

  // ── 1. Issue Statuses ───────────────────────────────────────────────────

  logger.info("Seeding issue statuses...");
  for (const status of STATUSES) {
    await db
      .insert(issueStatuses)
      .values(status)
      .onDuplicateKeyUpdate({
        set: {
          name: status.name,
          displayOrder: status.displayOrder,
          isTerminal: status.isTerminal,
        },
      });
  }
  logger.info(`  ✓ ${STATUSES.length} statuses upserted`);

  // ── 2. Issue Priorities ─────────────────────────────────────────────────

  logger.info("Seeding issue priorities...");
  for (const priority of PRIORITIES) {
    await db
      .insert(issuePriorities)
      .values(priority)
      .onDuplicateKeyUpdate({
        set: {
          name: priority.name,
          level: priority.level,
        },
      });
  }
  logger.info(`  ✓ ${PRIORITIES.length} priorities upserted`);

  // ── 3. Admin User ───────────────────────────────────────────────────────

  logger.info("Seeding admin user...");
  const adminName = process.env.ADMIN_NAME ?? "Admin";
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "Admin@123";

  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  await db
    .insert(users)
    .values({
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: "ADMIN",
      isEnabled: true,
    })
    .onDuplicateKeyUpdate({
      // On re-run: update name/role/isEnabled but NOT the password
      // (admin may have changed it after first seed)
      set: {
        name: adminName,
        role: "ADMIN",
        isEnabled: true,
      },
    });

  logger.info(`  ✓ Admin upserted: ${adminEmail}`);

  // ── 4. Normal User ─────────────────────────────────────────────────────

  logger.info("Seeding normal user...");
  const userName = process.env.USER_NAME ?? "Test User";
  const userEmail = process.env.USER_EMAIL ?? "user@gmail.com";
  const userPassword = process.env.USER_PASSWORD ?? "User@123";

  const userPasswordHash = await bcrypt.hash(userPassword, SALT_ROUNDS);

  await db
    .insert(users)
    .values({
      name: userName,
      email: userEmail,
      passwordHash: userPasswordHash,
      role: "USER",
      isEnabled: true,
    })
    .onDuplicateKeyUpdate({
      set: {
        name: userName,
        role: "USER",
        isEnabled: true,
      },
    });

  logger.info(`  ✓ Normal user upserted: ${userEmail}`);

  const [seedUsers] = await pool.query<RowDataPacket[]>(
    "SELECT id, email FROM users WHERE email IN (?, ?)",
    [adminEmail, userEmail],
  );

  const adminRow = seedUsers.find((row) => row.email === adminEmail);
  const userRow = seedUsers.find((row) => row.email === userEmail);

  if (!adminRow || !userRow) {
    throw new Error("Failed to resolve seeded user IDs");
  }

  const adminId = Number(adminRow.id);
  const userId = Number(userRow.id);

  // ── 5. Sample Issues ───────────────────────────────────────────────────

  logger.info("Seeding sample issues...");
  const sampleIssues: Array<{
    id: number;
    title: string;
    description: string;
    statusId: number;
    priorityId: number;
    createdBy: number;
    resolvedAt?: Date;
  }> = [
    {
      id: 1,
      title: "Login page validation bug",
      description:
        "Password error message is hidden when the login request fails.",
      statusId: 1,
      priorityId: 3,
      createdBy: adminId,
    },
    {
      id: 2,
      title: "Dashboard chart not updating",
      description: "Status counts remain stale after changing an issue status.",
      statusId: 2,
      priorityId: 2,
      createdBy: userId,
    },
    {
      id: 3,
      title: "Report export file naming",
      description:
        "Exported CSV and JSON files should include a predictable date suffix.",
      statusId: 3,
      priorityId: 4,
      createdBy: adminId,
      resolvedAt: new Date(),
    },
    {
      id: 4,
      title: "Profile save feedback",
      description: "Profile updates should show a success alert after saving.",
      statusId: 1,
      priorityId: 1,
      createdBy: userId,
    },
  ];

  for (const sampleIssue of sampleIssues) {
    const resolvedAt =
      "resolvedAt" in sampleIssue ? (sampleIssue.resolvedAt ?? null) : null;

    await db
      .insert(issues)
      .values(sampleIssue)
      .onDuplicateKeyUpdate({
        set: {
          title: sampleIssue.title,
          description: sampleIssue.description,
          statusId: sampleIssue.statusId,
          priorityId: sampleIssue.priorityId,
          createdBy: sampleIssue.createdBy,
          resolvedAt,
        },
      });
  }

  logger.info(`  ✓ ${sampleIssues.length} sample issues upserted`);

  // ── 6. FULLTEXT Index ───────────────────────────────────────────────────
  // Drizzle's typed index builder only supports btree/hash — FULLTEXT must
  // be created via raw SQL. This block is idempotent (ER_DUP_KEYNAME = 1061).

  logger.info("Ensuring FULLTEXT index on issues(title, description)...");
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT COUNT(*) AS cnt
             FROM information_schema.statistics
             WHERE table_schema = DATABASE()
               AND table_name   = 'issues'
               AND index_name   = 'ft_issues_search'`,
    );
    if ((rows[0] as { cnt: number }).cnt === 0) {
      await pool.query(
        "ALTER TABLE issues ADD FULLTEXT INDEX ft_issues_search (title, description)",
      );
      logger.info("  ✓ FULLTEXT index created");
    } else {
      logger.info("  ✓ FULLTEXT index already exists (skipped)");
    }
  } catch (err: unknown) {
    logger.warn(err, "  ⚠ Could not create FULLTEXT index — skipping");
  }

  logger.info("Database seed complete.");
}

seed()
  .catch((err: unknown) => {
    logger.error(err, "Seed failed");
    process.exit(1);
  })
  .finally(() => {
    // Close the connection pool so the process exits cleanly
    void pool.end();
  });
