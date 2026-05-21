import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../db/schema.js";
import type { JwtPayload } from "../types/index.js";
import { UnauthorizedError, ForbiddenError } from "./errorHandler.js";
export type { JwtPayload } from "../types/index.js";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

//authenticate
export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedError("No authorization token provided");
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      throw new UnauthorizedError(
        "Invalid authorization header format. Use: Bearer <token>",
      );
    }

    const token = parts[1]!;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      isEnabled: decoded.isEnabled,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError("Invalid token"));
    }
    if (error instanceof jwt.TokenExpiredError) {
      return next(new UnauthorizedError("Token has expired"));
    }
    next(error);
  }
};

// requireEnabled
export const requireEnabled = (
  _req: Request,
  __res: Response,
  next: NextFunction,
) => {
  const req = _req;
  if (!req.user) return next(new UnauthorizedError("Authentication required"));
  if (!req.user.isEnabled) {
    return next(new ForbiddenError("Your account has been disabled"));
  }
  next();
};

//authorize
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user)
      return next(new UnauthorizedError("Authentication required"));
    if (!roles.includes(req.user.role)) {
      return next(
        new ForbiddenError("You do not have permission to perform this action"),
      );
    }
    next();
  };
};

//optionalAuth
export const optionalAuth = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return next();

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") return next();

  try {
    const token = parts[1]!;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      name: decoded.name,
      role: decoded.role,
      isEnabled: decoded.isEnabled,
    };
  } catch {
    // Invalid or expired token — proceed as unauthenticated
  }

  next();
};

//generateToken
export const generateToken = (user: {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  isEnabled: boolean;
}): string => {
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    isEnabled: user.isEnabled,
  };

  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: (process.env.JWT_EXPIRES_IN ??
      "7d") as jwt.SignOptions["expiresIn"],
  });
};
