import { z } from "zod";

export const createIssueSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be at most 100 characters"),
  description: z
    .string()
    .trim()
    .min(3, "Description must be at least 3 characters")
    .max(2000, "Description must be at most 2000 characters")
    .nullish(),
  priorityId: z
    .number({ required_error: "Priority is required" })
    .int()
    .positive("Priority ID must be a positive integer"),
});

export const updateIssueSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "Title must be at least 3 characters")
      .max(100, "Title must be at most 100 characters")
      .optional(),
    description: z
      .string()
      .trim()
      .min(3, "Description must be at least 3 characters")
      .max(2000, "Description must be at most 2000 characters")
      .nullish(),
    priorityId: z.number().int().positive("Priority ID must be a positive integer").optional(),
    statusId: z.number().int().positive("Status ID must be a positive integer").optional(),
  })
  .refine(
    (obj) =>
      obj.title !== undefined ||
      obj.description !== undefined ||
      obj.priorityId !== undefined ||
      obj.statusId !== undefined,
    { message: "At least one field must be provided" },
  );

export const updateStatusSchema = z.object({
  statusId: z
    .number({ required_error: "Status ID is required" })
    .int()
    .positive("Status ID must be a positive integer"),
});

export const issueIdParamsSchema = z.object({
  id: z.coerce
    .number({ required_error: "Issue ID is required" })
    .int()
    .positive("Issue ID must be a positive integer"),
});

export const issueFiltersSchema = z.object({
  statusId: z.coerce.number().int().positive().optional(),
  priorityId: z.coerce.number().int().positive().optional(),
  createdBy: z.coerce.number().int().positive().optional(),
  search: z.string().trim().max(100).optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title"]).optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

export const exportFiltersSchema = z.object({
  statusId: z.coerce.number().int().positive().optional(),
  priorityId: z.coerce.number().int().positive().optional(),
  createdBy: z.coerce.number().int().positive().optional(),
  fromDate: z.string().optional(),
  toDate: z.string().optional(),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type UpdateIssueInput = z.infer<typeof updateIssueSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type IssueIdParams = z.infer<typeof issueIdParamsSchema>;
export type IssueFiltersInput = z.infer<typeof issueFiltersSchema>;
export type ExportFiltersInput = z.infer<typeof exportFiltersSchema>;
