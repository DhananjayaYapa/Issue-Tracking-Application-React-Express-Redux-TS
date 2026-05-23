//Issue status
export const ISSUE_STATUS = {
  OPEN: "Open" as const,
  IN_PROGRESS: "In Progress" as const,
  RESOLVED: "Resolved" as const,
  CLOSED: "Closed" as const,
};

// Issue status IDs
export const ISSUE_STATUS_IDS = {
  OPEN: 1,
  IN_PROGRESS: 2,
  RESOLVED: 3,
  CLOSED: 4,
} as const;

//Issue priority
export const ISSUE_PRIORITY = {
  LOW: "Low" as const,
  MEDIUM: "Medium" as const,
  HIGH: "High" as const,
  CRITICAL: "Critical" as const,
};

// Issue priority IDs
export const ISSUE_PRIORITY_IDS = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
  CRITICAL: 4,
} as const;
