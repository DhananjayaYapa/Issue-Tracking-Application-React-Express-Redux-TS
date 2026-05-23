// API routes
export const API_ROUTES = {
  // Auth
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  PROFILE: "/auth/profile",
  CHANGE_PASSWORD: "/auth/change-password",

  // Issues
  ISSUES: "/issues",
  ISSUE_BY_ID: (id: number) => `/issues/${id}`,
  ISSUE_STATUS: (id: number) => `/issues/${id}/status`,
  MY_ISSUES: "/issues/my-issues",
  STATUS_COUNTS: "/issues/stats/counts",
  MY_STATUS_COUNTS: "/issues/my-stats/counts",
  EXPORT_CSV: "/issues/export/csv",
  EXPORT_JSON: "/issues/export/json",
  METADATA: "/issues/metadata",

  // Users (Admin)
  USERS: "/users",
  USER_BY_ID: (id: number) => `/users/${id}`,
  USER_ENABLE: (id: number) => `/users/${id}/enable`,
  USER_PERMANENT_DELETE: (id: number) => `/users/${id}`,
  USER_DISABLE: (id: number) => `/users/${id}/disable`,
};

// App (frontend) routes
export const APP_ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  ISSUES: "/issues",
  MY_ISSUES: "/my-issues",
  ISSUE_DETAIL: (id: number | string) => `/issues/${id}`,
  ISSUE_CREATE: "/issues/new",
  ISSUE_EDIT: (id: number | string) => `/issues/${id}/edit`,
  PROFILE: "/profile",
  // Admin routes
  USERS: "/users",
  REPORT: "/report",
};
