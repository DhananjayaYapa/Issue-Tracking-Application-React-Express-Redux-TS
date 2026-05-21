import { Router } from "express";
import authRoutes from "../modules/auth/auth.routes.js";
import issuesRoutes from "../modules/issues/issues.routes.js";
import usersRoutes from "../modules/users/users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/issues", issuesRoutes);
router.use("/users", usersRoutes);

// Health Check
router.get("/health", (_req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
