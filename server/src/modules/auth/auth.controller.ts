import { Request, Response, NextFunction } from "express";
import AuthService from "./auth.service.js";
import {
  successResponse,
  createdResponse,
} from "../../shared/utils/responseHelper.js";

class AuthController {
  static async register(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await AuthService.register(req.body);
      createdResponse(res, result, "User registered successfully");
    } catch (error) {
      next(error);
    }
  }

  static async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const result = await AuthService.login(req.body);
      successResponse(res, result, "Login successful");
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await AuthService.getProfile(req.user!.userId);
      successResponse(res, user, "Profile retrieved successfully");
    } catch (error) {
      next(error);
    }
  }

  static async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = await AuthService.updateProfile(req.user!.userId, req.body);
      successResponse(res, user, "Profile updated successfully");
    } catch (error) {
      next(error);
    }
  }

  static async changePassword(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      await AuthService.changePassword(req.user!.userId, req.body);
      successResponse(res, null, "Password changed successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
