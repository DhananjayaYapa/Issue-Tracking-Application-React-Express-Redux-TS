import { count, eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { issues, users } from "../../db/schema.js";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "../../middleware/errorHandler.js";
import type { UserPublicDto } from "../../types/index.js";

class UserService {
  private static sharedSelect() {
    return {
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      isEnabled: users.isEnabled,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    };
  }

  // Get All Users
  static async getAllUsers(): Promise<UserPublicDto[]> {
    return db
      .select(UserService.sharedSelect())
      .from(users)
      .orderBy(users.createdAt);
  }

  // Get User By ID
  static async getUserById(userId: number): Promise<UserPublicDto> {
    const [user] = await db
      .select(UserService.sharedSelect())
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) throw new NotFoundError("User not found");

    return user;
  }

  // Enable User
  static async enableUser(targetId: number): Promise<UserPublicDto> {
    const [user] = await db
      .select({ id: users.id, isEnabled: users.isEnabled })
      .from(users)
      .where(eq(users.id, targetId))
      .limit(1);

    if (!user) throw new NotFoundError("User not found");
    if (user.isEnabled) throw new ConflictError("User is already enabled");

    await db
      .update(users)
      .set({ isEnabled: true })
      .where(eq(users.id, targetId));

    return UserService.getUserById(targetId);
  }

  // Disable User
  static async disableUser(targetId: number, adminId: number): Promise<void> {
    if (targetId === adminId) {
      throw new ValidationError("You cannot disable your own account");
    }

    const [user] = await db
      .select({ id: users.id, role: users.role, isEnabled: users.isEnabled })
      .from(users)
      .where(eq(users.id, targetId))
      .limit(1);

    if (!user) throw new NotFoundError("User not found");
    if (user.role === "ADMIN") {
      throw new ForbiddenError("Cannot disable another admin account");
    }
    if (!user.isEnabled) throw new ConflictError("User is already disabled");

    await db
      .update(users)
      .set({ isEnabled: false })
      .where(eq(users.id, targetId));
  }

  // Permanent Delete
  static async permanentDeleteUser(
    targetId: number,
    adminId: number,
  ): Promise<number> {
    if (targetId === adminId) {
      throw new ValidationError("You cannot delete your own account");
    }

    const [user] = await db
      .select({ id: users.id, role: users.role })
      .from(users)
      .where(eq(users.id, targetId))
      .limit(1);

    if (!user) throw new NotFoundError("User not found");
    if (user.role === "ADMIN") {
      throw new ForbiddenError("Cannot delete another admin account");
    }

    return db.transaction(async (tx) => {
      // Count before deleting
      const [{ total }] = await tx
        .select({ total: count() })
        .from(issues)
        .where(eq(issues.createdBy, targetId));

      await tx.delete(issues).where(eq(issues.createdBy, targetId));
      await tx.delete(users).where(eq(users.id, targetId));

      return total;
    });
  }
}

export default UserService;
