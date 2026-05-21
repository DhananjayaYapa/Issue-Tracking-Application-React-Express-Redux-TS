import { and, asc, count, desc, eq, gte, like, lte, or } from "drizzle-orm";
import { db } from "../../config/db.js";
import { issuePriorities, issueStatuses, issues, users } from "../../db/schema.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../middleware/errorHandler.js";
import { PAGINATION } from "../../shared/constants/index.js";
import type {
  IssueExportRow,
  IssueResponseDto,
  PaginatedResult,
  StatusCountsDto,
} from "../../types/index.js";
import type {
  CreateIssueInput,
  ExportFiltersInput,
  IssueFiltersInput,
  UpdateIssueInput,
} from "./issues.schema.js";

class IssueService {

  private static toDto(row: {
    id: number;
    title: string;
    description: string | null;
    status: string;
    priority: string;
    createdById: number;
    createdByName: string;
    createdByEmail: string;
    resolvedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }): IssueResponseDto {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      createdBy: {
        id: row.createdById,
        name: row.createdByName,
        email: row.createdByEmail,
      },
      resolvedAt: row.resolvedAt,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    };
  }

  //Build the shared SELECT columns used across paginated and single-row queries
  private static sharedSelect() {
    return {
      id: issues.id,
      title: issues.title,
      description: issues.description,
      status: issueStatuses.name,
      priority: issuePriorities.name,
      createdById: users.id,
      createdByName: users.name,
      createdByEmail: users.email,
      resolvedAt: issues.resolvedAt,
      createdAt: issues.createdAt,
      updatedAt: issues.updatedAt,
    };
  }

  //Compile WHERE conditions for list/export queries
  private static buildWhere(
    filters: IssueFiltersInput | ExportFiltersInput,
    forceCreatedBy?: number,
  ) {
    const conditions = [];

    const createdByValue =
      forceCreatedBy ?? (filters as IssueFiltersInput).createdBy;
    if (createdByValue) conditions.push(eq(issues.createdBy, createdByValue));
    if (filters.statusId) conditions.push(eq(issues.statusId, filters.statusId));
    if (filters.priorityId) conditions.push(eq(issues.priorityId, filters.priorityId));

    const search = (filters as IssueFiltersInput).search;
    if (search) {
      const term = `%${search}%`;
      conditions.push(
        or(like(issues.title, term), like(issues.description, term)),
      );
    }

    if (filters.fromDate) {
      conditions.push(gte(issues.createdAt, new Date(filters.fromDate)));
    }
    if (filters.toDate) {
      const end = new Date(filters.toDate);
      end.setHours(23, 59, 59, 999);
      conditions.push(lte(issues.createdAt, end));
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  // Core paginated fetch — getAllIssues and getMyIssues
  private static async fetchList(
    filters: IssueFiltersInput,
    forceCreatedBy?: number,
  ): Promise<PaginatedResult<IssueResponseDto>> {
    const where = IssueService.buildWhere(filters, forceCreatedBy);
    const page = filters.page ?? PAGINATION.DEFAULT_PAGE;
    const limit = filters.limit ?? PAGINATION.DEFAULT_LIMIT;

    const sortCol =
      filters.sortBy === "updatedAt"
        ? issues.updatedAt
        : filters.sortBy === "title"
          ? issues.title
          : issues.createdAt;
    const orderDir = filters.sortOrder === "asc" ? asc(sortCol) : desc(sortCol);

    const baseQuery = db
      .select(IssueService.sharedSelect())
      .from(issues)
      .innerJoin(issueStatuses, eq(issues.statusId, issueStatuses.id))
      .innerJoin(issuePriorities, eq(issues.priorityId, issuePriorities.id))
      .innerJoin(users, eq(issues.createdBy, users.id))
      .where(where);

    const [countResult, rows] = await Promise.all([
      db.select({ total: count() }).from(issues).where(where),
      baseQuery.orderBy(orderDir).limit(limit).offset((page - 1) * limit),
    ]);

    const total = countResult[0]?.total ?? 0;

    return {
      items: rows.map(IssueService.toDto),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  //Paginated list of all issues — admin only
  static async getAllIssues(
    filters: IssueFiltersInput,
  ): Promise<PaginatedResult<IssueResponseDto>> {
    return IssueService.fetchList(filters);
  }

  //Paginated list to the authenticated user
  static async getMyIssues(
    userId: number,
    filters: IssueFiltersInput,
  ): Promise<PaginatedResult<IssueResponseDto>> {
    return IssueService.fetchList(filters, userId);
  }

  //Single issue by ID
  static async getIssueById(issueId: number): Promise<IssueResponseDto> {
    const [row] = await db
      .select(IssueService.sharedSelect())
      .from(issues)
      .innerJoin(issueStatuses, eq(issues.statusId, issueStatuses.id))
      .innerJoin(issuePriorities, eq(issues.priorityId, issuePriorities.id))
      .innerJoin(users, eq(issues.createdBy, users.id))
      .where(eq(issues.id, issueId))
      .limit(1);

    if (!row) throw new NotFoundError("Issue not found");

    return IssueService.toDto(row);
  }

  //Create a new issue
  static async createIssue(
    data: CreateIssueInput,
    userId: number,
  ): Promise<IssueResponseDto> {
    const [inserted] = await db
      .insert(issues)
      .values({
        title: data.title,
        description: data.description ?? null,
        statusId: 1, // Always "Open" on creation
        priorityId: data.priorityId,
        createdBy: userId,
      })
      .$returningId();

    return IssueService.getIssueById(inserted.id);
  }

  //Update issue fields
  static async updateIssue(
    issueId: number,
    data: UpdateIssueInput,
    userId: number,
    userRole: string,
  ): Promise<IssueResponseDto> {
    const [existing] = await db
      .select({ id: issues.id, createdBy: issues.createdBy })
      .from(issues)
      .where(eq(issues.id, issueId))
      .limit(1);

    if (!existing) throw new NotFoundError("Issue not found");

    if (userRole === "USER" && existing.createdBy !== userId) {
      throw new ForbiddenError("You can only update your own issues");
    }

    if (userRole === "USER" && data.statusId !== undefined) {
      throw new ForbiddenError("Only admins can change issue status");
    }

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title;
    if (data.description !== undefined)
      updateData.description = data.description ?? null;
    if (data.priorityId !== undefined) updateData.priorityId = data.priorityId;

    if (data.statusId !== undefined) {
      const [status] = await db
        .select({ isTerminal: issueStatuses.isTerminal })
        .from(issueStatuses)
        .where(eq(issueStatuses.id, data.statusId))
        .limit(1);

      if (!status) throw new NotFoundError("Status not found");

      updateData.statusId = data.statusId;
      updateData.resolvedAt = status.isTerminal ? new Date() : null;
    }

    await db.update(issues).set(updateData).where(eq(issues.id, issueId));

    return IssueService.getIssueById(issueId);
  }

  //Admin-only status-only update
  static async updateStatus(
    issueId: number,
    statusId: number,
  ): Promise<IssueResponseDto> {
    const [existing] = await db
      .select({ id: issues.id })
      .from(issues)
      .where(eq(issues.id, issueId))
      .limit(1);

    if (!existing) throw new NotFoundError("Issue not found");

    const [status] = await db
      .select({ isTerminal: issueStatuses.isTerminal })
      .from(issueStatuses)
      .where(eq(issueStatuses.id, statusId))
      .limit(1);

    if (!status) throw new NotFoundError("Status not found");

    await db
      .update(issues)
      .set({
        statusId,
        resolvedAt: status.isTerminal ? new Date() : null,
      })
      .where(eq(issues.id, issueId));

    return IssueService.getIssueById(issueId);
  }

  //Delete issue — USER may only delete their own issues, ADMIN can delete any issue
  static async deleteIssue(
    issueId: number,
    userId: number,
    userRole: string,
  ): Promise<void> {
    const [existing] = await db
      .select({ id: issues.id, createdBy: issues.createdBy })
      .from(issues)
      .where(eq(issues.id, issueId))
      .limit(1);

    if (!existing) throw new NotFoundError("Issue not found");

    if (userRole === "USER" && existing.createdBy !== userId) {
      throw new ForbiddenError("You can only delete your own issues");
    }

    await db.delete(issues).where(eq(issues.id, issueId));
  }

  //Issue counts grouped by status
  static async getStatusCounts(userId?: number): Promise<StatusCountsDto> {
    const where = userId ? eq(issues.createdBy, userId) : undefined;

    const results = await db
      .select({ statusName: issueStatuses.name, cnt: count() })
      .from(issues)
      .innerJoin(issueStatuses, eq(issues.statusId, issueStatuses.id))
      .where(where)
      .groupBy(issueStatuses.id);

    const counts: StatusCountsDto = {
      Open: 0,
      "In Progress": 0,
      Resolved: 0,
      Closed: 0,
      total: 0,
    };

    for (const row of results) {
      if (Object.prototype.hasOwnProperty.call(counts, row.statusName)) {
        counts[row.statusName as keyof Omit<StatusCountsDto, "total">] =
          row.cnt;
      }
      counts.total += row.cnt;
    }

    return counts;
  }

  //Flat list for CSV/JSON export (no pagination)
  static async getIssuesForExport(
    filters: ExportFiltersInput,
    forceUserId?: number,
  ): Promise<IssueExportRow[]> {
    const where = IssueService.buildWhere(filters, forceUserId);

    const rows = await db
      .select({
        id: issues.id,
        title: issues.title,
        description: issues.description,
        status: issueStatuses.name,
        priority: issuePriorities.name,
        createdByName: users.name,
        resolvedAt: issues.resolvedAt,
        createdAt: issues.createdAt,
      })
      .from(issues)
      .innerJoin(issueStatuses, eq(issues.statusId, issueStatuses.id))
      .innerJoin(issuePriorities, eq(issues.priorityId, issuePriorities.id))
      .innerJoin(users, eq(issues.createdBy, users.id))
      .where(where)
      .orderBy(desc(issues.createdAt));

    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      status: r.status,
      priority: r.priority,
      createdBy: r.createdByName,
      resolvedAt: r.resolvedAt,
      createdAt: r.createdAt,
    }));
  }

  //data for client dropdowns
  static async getMetadata() {
    const [statuses, priorities] = await Promise.all([
      db
        .select({
          id: issueStatuses.id,
          name: issueStatuses.name,
          displayOrder: issueStatuses.displayOrder,
          isTerminal: issueStatuses.isTerminal,
        })
        .from(issueStatuses)
        .orderBy(asc(issueStatuses.displayOrder)),
      db
        .select({
          id: issuePriorities.id,
          name: issuePriorities.name,
          level: issuePriorities.level,
        })
        .from(issuePriorities)
        .orderBy(asc(issuePriorities.level)),
    ]);

    return { statuses, priorities };
  }
}

export default IssueService;
