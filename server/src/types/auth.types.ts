import type { UserRole } from "../db/schema.js";

export interface JwtPayload {
  userId: number;
  email: string;
  name: string;
  role: UserRole;
  isEnabled: boolean;
}

export interface AuthResponseDto {
  user: {
    id: number;
    name: string;
    email: string;
    role: UserRole;
    isEnabled: boolean;
  };
  token: string;
}
