import { Router } from "express";
import IssueController from "./issues.controller.js";
import { authenticate, authorize, requireEnabled } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { validate } from "../../middleware/validate.js";
import {
  createIssueSchema,
  exportFiltersSchema,
  issueFiltersSchema,
  issueIdParamsSchema,
  updateIssueSchema,
  updateStatusSchema,
} from "./issues.schema.js";

const router = Router();

// All issue routes require a valid JWT
router.use(authenticate);

router.get("/metadata", asyncHandler(IssueController.getMetadata));
router.get(
  "/stats/counts",
  authorize("ADMIN"),
  asyncHandler(IssueController.getStatusCounts),
);
router.get("/my-stats/counts", asyncHandler(IssueController.getMyStatusCounts));
router.get(
  "/export/csv",
  requireEnabled,
  validate({ query: exportFiltersSchema }),
  asyncHandler(IssueController.exportCSV),
);
router.get(
  "/export/json",
  requireEnabled,
  validate({ query: exportFiltersSchema }),
  asyncHandler(IssueController.exportJSON),
);
router.get(
  "/my-issues",
  validate({ query: issueFiltersSchema }),
  asyncHandler(IssueController.getMyIssues),
);
router.get(
  "/",
  authorize("ADMIN"),
  validate({ query: issueFiltersSchema }),
  asyncHandler(IssueController.getAllIssues),
);
router.post(
  "/",
  requireEnabled,
  validate({ body: createIssueSchema }),
  asyncHandler(IssueController.createIssue),
);

// Dynamic :id routes
router.get(
  "/:id",
  validate({ params: issueIdParamsSchema }),
  asyncHandler(IssueController.getIssueById),
);
router.put(
  "/:id",
  requireEnabled,
  validate({ params: issueIdParamsSchema, body: updateIssueSchema }),
  asyncHandler(IssueController.updateIssue),
);
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  validate({ params: issueIdParamsSchema, body: updateStatusSchema }),
  asyncHandler(IssueController.updateStatus),
);
router.delete(
  "/:id",
  requireEnabled,
  validate({ params: issueIdParamsSchema }),
  asyncHandler(IssueController.deleteIssue),
);

export default router;
