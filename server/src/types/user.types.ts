import type { UserRole } from "../db/schema.js";

export interface UserPublicDto {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isEnabled: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
}
