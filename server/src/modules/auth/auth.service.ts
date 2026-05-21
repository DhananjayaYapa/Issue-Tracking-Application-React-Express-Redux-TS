import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { users } from "../../db/schema.js";
import { generateToken } from "../../middleware/auth.js";
import { SALT_ROUNDS } from "../../shared/constants/index.js";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../middleware/errorHandler.js";
import type { AuthResponseDto } from "../../types/index.js";
import type {
  RegisterInput,
  LoginInput,
  UpdateProfileInput,
  ChangePasswordInput,
} from "./auth.schema.js";

class AuthService {
  static async register(data: RegisterInput): Promise<AuthResponseDto> {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing) {
      throw new ConflictError("Email already registered");
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);

    await db.insert(users).values({
      name: data.name,
      email: data.email,
      passwordHash,
      role: "USER",
      isEnabled: true,
    });

    // Fetch the just-created row (avoids relying on insertId)
    const [newUser] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isEnabled: users.isEnabled,
      })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!newUser) throw new Error("Failed to create user");

    const token = generateToken(newUser);

    return { user: newUser, token };
  }

  static async login(data: LoginInput): Promise<AuthResponseDto> {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEnabled: user.isEnabled,
      },
      token,
    };
  }

  static async getProfile(userId: number) {
    const [user] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isEnabled: users.isEnabled,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  static async updateProfile(userId: number, data: UpdateProfileInput) {
    const [existing] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!existing) {
      throw new NotFoundError("User not found");
    }

    await db.update(users).set({ name: data.name }).where(eq(users.id, userId));

    const [updated] = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        isEnabled: users.isEnabled,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    return updated!;
  }

  static async changePassword(
    userId: number,
    data: ChangePasswordInput,
  ): Promise<void> {
    const [user] = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isValid = await bcrypt.compare(
      data.currentPassword,
      user.passwordHash,
    );

    if (!isValid) {
      throw new ValidationError("Current password is incorrect");
    }

    const passwordHash = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

    await db.update(users).set({ passwordHash }).where(eq(users.id, userId));
  }
}

export default AuthService;
