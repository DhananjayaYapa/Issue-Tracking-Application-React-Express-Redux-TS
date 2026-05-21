import { Router } from "express";
import AuthController from "./auth.controller.js";
import { authenticate, requireEnabled } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { validate } from "../../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "./auth.schema.js";

const router = Router();

router.post(
  "/register",
  validate({ body: registerSchema }),
  asyncHandler(AuthController.register),
);

router.post(
  "/login",
  validate({ body: loginSchema }),
  asyncHandler(AuthController.login),
);

router.get("/profile", authenticate, asyncHandler(AuthController.getProfile));

router.put(
  "/profile",
  authenticate,
  requireEnabled,
  validate({ body: updateProfileSchema }),
  asyncHandler(AuthController.updateProfile),
);

router.put(
  "/change-password",
  authenticate,
  requireEnabled,
  validate({ body: changePasswordSchema }),
  asyncHandler(AuthController.changePassword),
);

export default router;
