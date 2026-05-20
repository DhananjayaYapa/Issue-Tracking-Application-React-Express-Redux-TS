import type { UserRole } from "../../db/schema.js";

export type { UserRole };

export const USER_ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
} as const;

export const VALID_ROLES = Object.values(USER_ROLES) as UserRole[];

//Feature Keys

export const FEATURE_KEYS = {
    // Issue actions
    CREATE_ISSUE: 'IT_FE001',
    VIEW_OWN_ISSUES: 'IT_FE002',
    UPDATE_OWN_ISSUE: 'IT_FE003',
    VIEW_ALL_ISSUES: 'IT_FE004',
    DELETE_ISSUE: 'IT_FE005',
    CHANGE_ISSUE_STATUS: 'IT_FE006',

    // User management actions
    VIEW_ALL_USERS: 'IT_FE010',
    DELETE_USER: 'IT_FE011',

    // Stats & reports
    VIEW_ALL_STATUS_COUNTS: 'IT_FE020',
    EXPORT_ISSUES: 'IT_FE021',
} as const;

export type FeatureKey = (typeof FEATURE_KEYS)[keyof typeof FEATURE_KEYS];

//Feature Mapping
export const ROLE_FEATURES: Record<UserRole, FeatureKey[]> = {
    [USER_ROLES.ADMIN]: [
        FEATURE_KEYS.VIEW_ALL_ISSUES,
        FEATURE_KEYS.DELETE_ISSUE,
        FEATURE_KEYS.CHANGE_ISSUE_STATUS,
        FEATURE_KEYS.VIEW_ALL_USERS,
        FEATURE_KEYS.DELETE_USER,
        FEATURE_KEYS.VIEW_ALL_STATUS_COUNTS,
        FEATURE_KEYS.EXPORT_ISSUES,
    ],
    [USER_ROLES.USER]: [
        FEATURE_KEYS.CREATE_ISSUE,
        FEATURE_KEYS.VIEW_OWN_ISSUES,
        FEATURE_KEYS.UPDATE_OWN_ISSUE,
    ],
};

//permission helper
export const hasFeaturePermission = (role: UserRole, featureKey: FeatureKey): boolean => {
    const features = ROLE_FEATURES[role];
    if (!features) return false;
    return features.includes(featureKey);
};
