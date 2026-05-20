export interface IssueResponseDto {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  resolvedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface IssueFiltersDto {
  statusId?: number;
  priorityId?: number;
  createdBy?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface StatusCountsDto {
  Open: number;
  "In Progress": number;
  Resolved: number;
  Closed: number;
  total: number;
}

export interface IssueExportRow {
  id: number;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  createdBy: string;
  resolvedAt: Date | string | null;
  createdAt: Date | string;
}
