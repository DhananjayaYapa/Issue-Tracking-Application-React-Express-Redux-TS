import type { AxiosError } from "axios";
import { issueService } from "../../services";
import { issueActions } from "../slices";
import { dispatchAlert } from "../../utilities/helpers";
import type {
  CreateIssuePayload,
  ExportFiltersDto,
  FetchIssuesParams,
  FetchMyIssuesParams,
  IssueParams,
  UpdateIssuePayload,
  UpdateIssueStatusDto,
} from "../../utilities/models";
import type { AppDispatch } from "../store";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    "Oops! Something went wrong."
  );
};

const downloadBlob = (
  blob: Blob,
  filename: string,
): void => {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};

const getFilenameFromDisposition = (
  contentDisposition: string | undefined,
  fallback: string,
): string => {
  if (!contentDisposition) {
    return fallback;
  }

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const basicMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (basicMatch?.[1]) {
    return basicMatch[1];
  }

  return fallback;
};

export const fetchIssues = (params?: FetchIssuesParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.fetchIssuesRequest(params?.filters));

    try {
      const response = await issueService.getIssues(params?.filters);
      dispatch(issueActions.fetchIssuesSuccess(response.data.data));
    } catch (error) {
      dispatch(issueActions.fetchIssuesError(getErrorMessage(error)));
    }
  };
};

export const fetchIssue = (params: IssueParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.fetchIssueRequest());

    try {
      const response = await issueService.getIssue(params);
      dispatch(issueActions.fetchIssueSuccess(response.data.data));
    } catch (error) {
      dispatch(issueActions.fetchIssueError(getErrorMessage(error)));
    }
  };
};

export const createIssue = (payload: CreateIssuePayload) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.createIssueRequest());

    try {
      const response = await issueService.createIssue(payload);
      dispatch(issueActions.createIssueSuccess(response.data.data));
      dispatchAlert(dispatch, {
        message: response.data.message || "Issue created successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(issueActions.createIssueError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const updateIssue = (payload: UpdateIssuePayload) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.updateIssueRequest());

    try {
      const { id, ...data } = payload;
      const response = await issueService.updateIssue({ id }, data);
      dispatch(issueActions.updateIssueSuccess(response.data.data));
      dispatchAlert(dispatch, {
        message: response.data.message || "Issue updated successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(issueActions.updateIssueError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const updateIssueStatus = (payload: UpdateIssueStatusDto) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.updateIssueRequest());

    try {
      const response = await issueService.updateIssueStatus(payload);
      dispatch(issueActions.updateIssueSuccess(response.data.data));
      dispatchAlert(dispatch, {
        message: response.data.message || "Issue status updated successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(issueActions.updateIssueError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const deleteIssue = (params: IssueParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.deleteIssueRequest());

    try {
      await issueService.deleteIssue(params);
      dispatch(issueActions.deleteIssueSuccess(params.id));
      dispatchAlert(dispatch, {
        message: "Issue deleted successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(issueActions.deleteIssueError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const fetchStatusCounts = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.fetchStatusCountsRequest());

    try {
      const response = await issueService.getStatusCounts();
      dispatch(issueActions.fetchStatusCountsSuccess(response.data.data));
    } catch (error) {
      dispatch(issueActions.fetchStatusCountsError(getErrorMessage(error)));
    }
  };
};

export const fetchMyStatusCounts = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.fetchStatusCountsRequest());

    try {
      const response = await issueService.getMyStatusCounts();
      dispatch(issueActions.fetchStatusCountsSuccess(response.data.data));
    } catch (error) {
      dispatch(issueActions.fetchStatusCountsError(getErrorMessage(error)));
    }
  };
};

export const fetchMetadata = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.fetchMetadataRequest());

    try {
      const response = await issueService.getMetadata();
      dispatch(issueActions.fetchMetadataSuccess(response.data.data));
    } catch (error) {
      dispatch(issueActions.fetchMetadataError(getErrorMessage(error)));
    }
  };
};

export const fetchMyIssues = (params?: FetchMyIssuesParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.fetchIssuesRequest(params?.filters));

    try {
      const response = await issueService.getMyIssues(params?.filters);
      dispatch(issueActions.fetchIssuesSuccess(response.data.data));
    } catch (error) {
      dispatch(issueActions.fetchIssuesError(getErrorMessage(error)));
    }
  };
};

export const exportCsv = (params?: ExportFiltersDto) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.setLoading(true));

    try {
      const response = await issueService.exportCsv(params);
      const filename = getFilenameFromDisposition(
        response.headers["content-disposition"],
        "issues-report.csv",
      );
      downloadBlob(response.data as Blob, filename);
      dispatch(issueActions.setLoading(false));
      dispatchAlert(dispatch, {
        message: "CSV report exported successfully",
        severity: "success",
      });
    } catch (error) {
      dispatch(issueActions.fetchIssuesError(getErrorMessage(error)));
      dispatchAlert(dispatch, {
        message: getErrorMessage(error),
        severity: "error",
      });
    }
  };
};

export const exportJson = (params?: ExportFiltersDto) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(issueActions.setLoading(true));

    try {
      const response = await issueService.exportJson(params);
      const filename = getFilenameFromDisposition(
        response.headers["content-disposition"],
        "issues-report.json",
      );
      downloadBlob(response.data as Blob, filename);
      dispatch(issueActions.setLoading(false));
      dispatchAlert(dispatch, {
        message: "JSON report exported successfully",
        severity: "success",
      });
    } catch (error) {
      dispatch(issueActions.fetchIssuesError(getErrorMessage(error)));
      dispatchAlert(dispatch, {
        message: getErrorMessage(error),
        severity: "error",
      });
    }
  };
};
