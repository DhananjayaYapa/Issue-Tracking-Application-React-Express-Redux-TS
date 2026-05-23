import { API_ROUTES } from "../utilities/constants";
import type {
  Issue,
  IssueFiltersDto,
  CreateIssuePayload,
  UpdateIssuePayload,
  UpdateIssueStatusDto,
  StatusCountsDto,
  ApiResponseDto,
  IssueMetadataDto,
  ExportFiltersDto,
  IssueParams,
  PaginatedResult,
} from "../utilities/models";
import { axiosPrivateInstance } from "./axios";

const getIssues = (filters?: IssueFiltersDto) => {
  return axiosPrivateInstance.get<ApiResponseDto<PaginatedResult<Issue>>>(
    API_ROUTES.ISSUES,
    {
      params: filters,
    },
  );
};

const getIssue = (params: IssueParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<Issue>>(
    API_ROUTES.ISSUE_BY_ID(params.id),
  );
};

const createIssue = (payload: CreateIssuePayload) => {
  return axiosPrivateInstance.post<ApiResponseDto<Issue>>(
    API_ROUTES.ISSUES,
    payload,
  );
};

const updateIssue = (
  params: IssueParams,
  payload: Omit<UpdateIssuePayload, "id">,
) => {
  return axiosPrivateInstance.put<ApiResponseDto<Issue>>(
    API_ROUTES.ISSUE_BY_ID(params.id),
    payload,
  );
};

const updateIssueStatus = (payload: UpdateIssueStatusDto) => {
  return axiosPrivateInstance.patch<ApiResponseDto<Issue>>(
    API_ROUTES.ISSUE_STATUS(payload.id),
    {
      statusId: payload.statusId,
    },
  );
};

const deleteIssue = (params: IssueParams) => {
  return axiosPrivateInstance.delete(API_ROUTES.ISSUE_BY_ID(params.id));
};

const getStatusCounts = () => {
  return axiosPrivateInstance.get<ApiResponseDto<StatusCountsDto>>(
    API_ROUTES.STATUS_COUNTS,
  );
};

const getMyStatusCounts = () => {
  return axiosPrivateInstance.get<ApiResponseDto<StatusCountsDto>>(
    API_ROUTES.MY_STATUS_COUNTS,
  );
};

const getMyIssues = (filters?: IssueFiltersDto) => {
  return axiosPrivateInstance.get<ApiResponseDto<PaginatedResult<Issue>>>(
    API_ROUTES.MY_ISSUES,
    {
      params: filters,
    },
  );
};

const exportCsv = (params?: ExportFiltersDto) => {
  return axiosPrivateInstance.get(API_ROUTES.EXPORT_CSV, {
    params,
    responseType: "blob",
  });
};

const exportJson = (params?: ExportFiltersDto) => {
  return axiosPrivateInstance.get(API_ROUTES.EXPORT_JSON, {
    params,
    responseType: "blob",
  });
};

const getMetadata = () => {
  return axiosPrivateInstance.get<ApiResponseDto<IssueMetadataDto>>(
    API_ROUTES.METADATA,
  );
};

export const issueService = {
  getIssues,
  getIssue,
  createIssue,
  updateIssue,
  updateIssueStatus,
  deleteIssue,
  getStatusCounts,
  getMyStatusCounts,
  getMyIssues,
  exportCsv,
  exportJson,
  getMetadata,
};
