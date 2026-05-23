// Status colors for badges
export const STATUS_COLORS: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  Open: "info",
  "In Progress": "warning",
  Resolved: "success",
  Closed: "default",
};

export const PRIORITY_COLORS: Record<
  string,
  "default" | "primary" | "secondary" | "error" | "info" | "success" | "warning"
> = {
  Low: "default",
  Medium: "primary",
  High: "warning",
  Critical: "error",
};

export const PRIORITY_BORDER_COLORS: Record<string, string> = {
  Low: "#9e9e9e",
  Medium: "#1976d2",
  High: "#ed6c02",
  Critical: "#d32f2f",
};
