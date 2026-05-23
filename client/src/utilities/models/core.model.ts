import type { AuthStateDto } from "./auth.model";
import type { IssueStateDto } from "./issue.model";
import type { UserManagementStateDto } from "./user.model";
import type { AlertDto } from "./alert.model";

// API Response Types
export interface ApiResponseDto<T> {
  data: T;
  message: string;
}

export interface ApiErrorDto {
  success: false;
  message: string;
  errors?: Array<{ field: string; message: string }>;
}

// // Generic paginated result
// export interface PaginatedResult<T> {
//   items: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// App State (Root)
export interface AppStateDto {
  auth: AuthStateDto;
  issues: IssueStateDto;
  users: UserManagementStateDto;
  alert: AlertDto | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}
