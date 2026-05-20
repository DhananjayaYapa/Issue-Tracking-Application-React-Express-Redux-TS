import { relations, sql } from "drizzle-orm";
import {
  boolean,
  datetime,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

// Users
export const users = mysqlTable(
  "users",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    passwordHash: varchar("password_hash", { length: 255 }).notNull(),
    role: mysqlEnum("role", ["ADMIN", "USER"]).notNull().default("USER"),
    isEnabled: boolean("is_enabled").notNull().default(true),
    createdAt: datetime("created_at", { fsp: 0 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at", { fsp: 0 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    index("idx_users_role").on(table.role),
  ],
);

// Issue Statuses
export const issueStatuses = mysqlTable(
  "issue_statuses",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    displayOrder: int("display_order").notNull(),
    isTerminal: boolean("is_terminal").notNull().default(false),
  },
  (table) => [
    uniqueIndex("issue_statuses_name_unique").on(table.name),
    uniqueIndex("issue_statuses_order_unique").on(table.displayOrder),
  ],
);

// Issue Priorities
export const issuePriorities = mysqlTable(
  "issue_priorities",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 50 }).notNull(),
    level: int("level").notNull(),
  },
  (table) => [
    uniqueIndex("issue_priorities_name_unique").on(table.name),
    uniqueIndex("issue_priorities_level_unique").on(table.level),
  ],
);

// Issues
export const issues = mysqlTable(
  "issues",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 100 }).notNull(),
    description: text("description"),
    statusId: int("status_id")
      .notNull()
      .default(1)
      .references(() => issueStatuses.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    priorityId: int("priority_id")
      .notNull()
      .default(2)
      .references(() => issuePriorities.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    createdBy: int("created_by")
      .notNull()
      .references(() => users.id, {
        onDelete: "restrict",
        onUpdate: "cascade",
      }),
    resolvedAt: datetime("resolved_at", { fsp: 0 }),
    createdAt: datetime("created_at", { fsp: 0 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: datetime("updated_at", { fsp: 0 })
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`)
      .$onUpdateFn(() => new Date()),
  },
  (table) => [
    // Single-column indexes
    index("idx_issues_status_id").on(table.statusId),
    index("idx_issues_priority_id").on(table.priorityId),
    index("idx_issues_created_by").on(table.createdBy),
    index("idx_issues_created_at").on(table.createdAt),
    // Composite indexes
    index("idx_issues_created_by_status").on(table.createdBy, table.statusId),
    index("idx_issues_status_created_at").on(table.statusId, table.createdAt),
    index("idx_issues_created_by_created_at").on(
      table.createdBy,
      table.createdAt,
    ),
  ],
);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  issues: many(issues),
}));

export const issueStatusesRelations = relations(issueStatuses, ({ many }) => ({
  issues: many(issues),
}));

export const issuePrioritiesRelations = relations(
  issuePriorities,
  ({ many }) => ({
    issues: many(issues),
  }),
);

export const issuesRelations = relations(issues, ({ one }) => ({
  status: one(issueStatuses, {
    fields: [issues.statusId],
    references: [issueStatuses.id],
  }),
  priority: one(issuePriorities, {
    fields: [issues.priorityId],
    references: [issuePriorities.id],
  }),
  creator: one(users, {
    fields: [issues.createdBy],
    references: [users.id],
  }),
}));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type IssueStatus = typeof issueStatuses.$inferSelect;
export type IssuePriority = typeof issuePriorities.$inferSelect;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
export type UserRole = "ADMIN" | "USER";
