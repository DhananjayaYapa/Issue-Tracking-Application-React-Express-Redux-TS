import { Router } from "express";
import UserController from "./users.controller.js";
import { authenticate, authorize } from "../../middleware/auth.js";
import { asyncHandler } from "../../middleware/errorHandler.js";
import { validate } from "../../middleware/validate.js";
import { userIdParamsSchema } from "./users.schema.js";

const router = Router();

router.use(authenticate, authorize("ADMIN"));

router.get("/", asyncHandler(UserController.getAllUsers));
router.get(
  "/:id",
  validate({ params: userIdParamsSchema }),
  asyncHandler(UserController.getUserById),
);
router.patch(
  "/:id/enable",
  validate({ params: userIdParamsSchema }),
  asyncHandler(UserController.enableUser),
);
router.patch(
  "/:id/disable",
  validate({ params: userIdParamsSchema }),
  asyncHandler(UserController.disableUser),
);
router.delete(
  "/:id",
  validate({ params: userIdParamsSchema }),
  asyncHandler(UserController.permanentDeleteUser),
);

export default router;
