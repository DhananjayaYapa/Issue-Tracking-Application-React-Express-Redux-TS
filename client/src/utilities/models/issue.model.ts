export type IssueStatus = "Open" | "In Progress" | "Resolved" | "Closed";
export type IssuePriority = "Low" | "Medium" | "High" | "Critical";

export interface Issue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
}

export interface CreateIssuePayload {
  title: string;
  description: string;
  priorityId: number;
  statusId?: number;
}

export interface UpdateIssuePayload {
  id: number;
  title?: string;
  description?: string;
  priorityId?: number;
  statusId?: number;
}

export interface UpdateIssueStatusDto {
  id: number;
  statusId: number;
}

export interface IssueFiltersDto {
  statusId?: number;
  priorityId?: number;
  fromDate?: string;
  toDate?: string;
  createdBy?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface ExportFiltersDto {
  statusId?: number;
  priorityId?: number;
  fromDate?: string;
  toDate?: string;
  createdBy?: number;
}

export interface StatusCountsDto {
  Open: number;
  "In Progress": number;
  Resolved: number;
  Closed: number;
  total: number;
}

export interface MetadataItem {
  id: number;
  name: string;
}

export interface IssueMetadataDto {
  statuses: MetadataItem[];
  priorities: MetadataItem[];
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IssueParams {
  id: number;
}

export interface FetchIssuesParams {
  filters?: IssueFiltersDto;
}

export interface FetchMyIssuesParams {
  filters?: IssueFiltersDto;
}

export interface IssueStateDto {
  issues: Issue[];
  totalIssues: number;
  currentPage: number;
  totalPages: number;
  currentIssue: Issue | null;
  statusCounts: StatusCountsDto | null;
  metadata: IssueMetadataDto | null;
  filters: IssueFiltersDto;
  isLoading: boolean;
  error: string | null;
}

export interface FormField {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  validator: string;
  isRequired: boolean;
  minLength?: number;
  maxLength?: number;
  error: string | null;
}

export interface IssueFormData {
  title: FormField;
  description: FormField;
  statusId: FormField;
  priorityId: FormField;
}
