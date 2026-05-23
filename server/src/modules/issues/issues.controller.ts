import { Request, Response, NextFunction } from "express";
import IssueService from "./issues.service.js";
import {
  createdResponse,
  noContentResponse,
  successResponse,
} from "../../shared/utils/responseHelper.js";
import {
  exportIssuesToCSV,
  exportIssuesToJSON,
} from "../../shared/utils/exportHelper.js";

class IssueController {
  static async getMetadata(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const metadata = await IssueService.getMetadata();
      successResponse(res, metadata, "Metadata retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Status Counts (admin — all issues)
  static async getStatusCounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const counts = await IssueService.getStatusCounts();
      successResponse(res, counts, "Status counts retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // My Status Counts (authenticated user)
  static async getMyStatusCounts(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const counts = await IssueService.getStatusCounts(req.user!.userId);
      successResponse(res, counts, "Your status counts retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Export CSV
  static async exportCSV(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const forceUserId =
        req.user!.role === "USER" ? req.user!.userId : undefined;
      const issues = await IssueService.getIssuesForExport(
        req.query as never,
        forceUserId,
      );
      const csv = exportIssuesToCSV(issues);
      const filename = `issues_export_${Date.now()}.csv`;

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.send(csv);
    } catch (error) {
      next(error);
    }
  }

  // Export JSON
  static async exportJSON(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const forceUserId =
        req.user!.role === "USER" ? req.user!.userId : undefined;
      const issues = await IssueService.getIssuesForExport(
        req.query as never,
        forceUserId,
      );
      const payload = exportIssuesToJSON(issues);
      const filename = `issues_export_${Date.now()}.json`;

      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.json(payload);
    } catch (error) {
      next(error);
    }
  }

  // Get My Issues
  static async getMyIssues(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await IssueService.getMyIssues(
        req.user!.userId,
        req.query as never,
      );
      successResponse(res, result, "Your issues retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get All Issues (admin)
  static async getAllIssues(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await IssueService.getAllIssues(req.query as never);
      successResponse(res, result, "Issues retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get Issue By ID
  static async getIssueById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issueId = Number(req.params.id);
      const issue = await IssueService.getIssueById(issueId);

      // Users may only view their own issues
      if (
        req.user!.role === "USER" &&
        issue.createdBy.id !== req.user!.userId
      ) {
        res.status(403).json({
          success: false,
          message: "You can only view your own issues",
        });
        return;
      }

      successResponse(res, issue, "Issue retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Create Issue
  static async createIssue(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issue = await IssueService.createIssue(
        req.body,
        req.user!.userId,
      );
      createdResponse(res, issue, "Issue created successfully");
    } catch (error) {
      next(error);
    }
  }

  // Update Issue
  static async updateIssue(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issue = await IssueService.updateIssue(
        Number(req.params.id),
        req.body,
        req.user!.userId,
        req.user!.role,
      );
      successResponse(res, issue, "Issue updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // Update Status (admin only)
  static async updateStatus(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const issue = await IssueService.updateStatus(
        Number(req.params.id),
        req.body.statusId,
      );
      successResponse(res, issue, "Issue status updated successfully");
    } catch (error) {
      next(error);
    }
  }

  // Delete Issue
  static async deleteIssue(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await IssueService.deleteIssue(
        Number(req.params.id),
        req.user!.userId,
        req.user!.role,
      );
      noContentResponse(res);
    } catch (error) {
      next(error);
    }
  }
}

export default IssueController;
