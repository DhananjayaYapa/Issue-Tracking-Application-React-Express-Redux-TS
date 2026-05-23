export type UserRole = "ADMIN" | "USER";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isEnabled?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthStateDto {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthResponseDto {
  user: User;
  token: string;
}

export interface PasswordFormField {
  value: string;
  validator: string;
  isRequired: boolean;
  minLength?: number;
  error: string | null;
}

export interface PasswordFormData {
  currentPassword: PasswordFormField;
  newPassword: PasswordFormField;
  confirmPassword: PasswordFormField;
}
