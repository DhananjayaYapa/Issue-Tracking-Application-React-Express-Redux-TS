import "dotenv/config";
import bcrypt from "bcryptjs";
import type { RowDataPacket } from "mysql2";
import { db, pool } from "../src/config/db.js";
import logger from "../src/config/logger.js";
import { issueStatuses, issuePriorities, users } from "../src/db/schema.js";

const SALT_ROUNDS = 10;

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


async function seed() {
  logger.info("Starting database seed...");

  //Issue Statuses
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

  // Issue Priorities
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

  // Admin User
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
      set: {
        name: adminName,
        role: "ADMIN",
        isEnabled: true,
      },
    });

  logger.info(`  ✓ Admin upserted: ${adminEmail}`);

  // FULLTEXT Index
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
    // Close the connection pool
    void pool.end();
  });
