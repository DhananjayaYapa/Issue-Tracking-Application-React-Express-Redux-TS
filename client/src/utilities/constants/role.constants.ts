// User Roles
export const USER_ROLES = {
  ADMIN: "ADMIN" as const,
  USER: "USER" as const,
};

// Application Feature Keys
export const APP_FEATURE_KEYS = {
  // Issue actions
  CREATE_ISSUE: "IT_FE001",
  VIEW_OWN_ISSUES: "IT_FE002",
  UPDATE_OWN_ISSUE: "IT_FE003",
  VIEW_ALL_ISSUES: "IT_FE004",
  DELETE_ISSUE: "IT_FE005",
  CHANGE_ISSUE_STATUS: "IT_FE006",

  // User management actions
  VIEW_ALL_USERS: "IT_FE010",
  DELETE_USER: "IT_FE011",
  DISABLE_USER: "IT_FE012",

  // Stats & reports
  VIEW_ALL_STATUS_COUNTS: "IT_FE020",
  EXPORT_ISSUES: "IT_FE021",
} as const;

// Role to Feature Mapping
export const ROLE_FEATURES: Record<string, string[]> = {
  [USER_ROLES.ADMIN]: [
    APP_FEATURE_KEYS.VIEW_ALL_ISSUES,
    APP_FEATURE_KEYS.DELETE_ISSUE,
    APP_FEATURE_KEYS.CHANGE_ISSUE_STATUS,
    APP_FEATURE_KEYS.VIEW_ALL_USERS,
    APP_FEATURE_KEYS.DELETE_USER,
    APP_FEATURE_KEYS.DISABLE_USER,
    APP_FEATURE_KEYS.VIEW_ALL_STATUS_COUNTS,
    APP_FEATURE_KEYS.EXPORT_ISSUES,
  ],
  [USER_ROLES.USER]: [
    APP_FEATURE_KEYS.CREATE_ISSUE,
    APP_FEATURE_KEYS.VIEW_OWN_ISSUES,
    APP_FEATURE_KEYS.UPDATE_OWN_ISSUE,
  ],
};

export const hasFeaturePermission = (
  role: string,
  featureKey: string,
): boolean => {
  const features = ROLE_FEATURES[role];
  if (!features) return false;
  return features.includes(featureKey);
};

export const getRoleFeatures = (role: string): string[] => {
  return ROLE_FEATURES[role] || [];
};
