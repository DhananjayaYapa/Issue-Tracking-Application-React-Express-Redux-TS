import { Request, Response, NextFunction } from "express";
import UserService from "./users.service.js";
import {
  noContentResponse,
  successResponse,
} from "../../shared/utils/responseHelper.js";

class UserController {
  // Get All Users
  static async getAllUsers(
    _: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      successResponse(res, users, "Users retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Get User By ID
  static async getUserById(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.getUserById(Number(req.params.id));
      successResponse(res, user, "User retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  // Enable User
  static async enableUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await UserService.enableUser(Number(req.params.id));
      successResponse(res, user, "User enabled successfully");
    } catch (error) {
      next(error);
    }
  }

  // Disable User
  static async disableUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await UserService.disableUser(Number(req.params.id), req.user!.userId);
      noContentResponse(res);
    } catch (error) {
      next(error);
    }
  }

  // Permanent Delete
  static async permanentDeleteUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const deletedIssues = await UserService.permanentDeleteUser(
        Number(req.params.id),
        req.user!.userId,
      );
      successResponse(
        res,
        { deletedIssues },
        `User and ${deletedIssues} related issue(s) permanently deleted`,
      );
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
