import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  Issue,
  IssueFiltersDto,
  IssueMetadataDto,
  IssueStateDto,
  PaginatedResult,
  StatusCountsDto,
} from "../../utilities/models";

const initialState: IssueStateDto = {
  issues: [],
  totalIssues: 0,
  currentPage: 1,
  totalPages: 0,
  currentIssue: null,
  statusCounts: null,
  metadata: null,
  filters: {},
  isLoading: false,
  error: null,
};

const issueSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    fetchIssuesRequest: (state, action: PayloadAction<IssueFiltersDto | undefined>) => {
      state.isLoading = true;
      state.error = null;
      if (action.payload) {
        state.filters = { ...state.filters, ...action.payload };
      }
    },
    fetchIssuesSuccess: (state, action: PayloadAction<PaginatedResult<Issue>>) => {
      state.isLoading = false;
      state.issues = action.payload.items;
      state.totalIssues = action.payload.total;
      state.currentPage = action.payload.page;
      state.totalPages = action.payload.totalPages;
      state.error = null;
    },
    fetchIssuesError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchIssueRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchIssueSuccess: (state, action: PayloadAction<Issue>) => {
      state.isLoading = false;
      state.currentIssue = action.payload;
      state.error = null;
    },
    fetchIssueError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    createIssueRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    createIssueSuccess: (state, action: PayloadAction<Issue>) => {
      state.isLoading = false;
      state.currentIssue = action.payload;
      state.issues = [action.payload, ...state.issues];
      state.totalIssues += 1;
      state.error = null;
    },
    createIssueError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateIssueRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateIssueSuccess: (state, action: PayloadAction<Issue>) => {
      state.isLoading = false;
      state.currentIssue = action.payload;
      state.issues = state.issues.map((issue) =>
        issue.id === action.payload.id ? action.payload : issue,
      );
      state.error = null;
    },
    updateIssueError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    deleteIssueRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    deleteIssueSuccess: (state, action: PayloadAction<number>) => {
      state.isLoading = false;
      state.issues = state.issues.filter((issue) => issue.id !== action.payload);
      if (state.currentIssue?.id === action.payload) {
        state.currentIssue = null;
      }
      state.totalIssues = Math.max(0, state.totalIssues - 1);
      state.error = null;
    },
    deleteIssueError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchStatusCountsRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchStatusCountsSuccess: (state, action: PayloadAction<StatusCountsDto>) => {
      state.isLoading = false;
      state.statusCounts = action.payload;
      state.error = null;
    },
    fetchStatusCountsError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    fetchMetadataRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchMetadataSuccess: (state, action: PayloadAction<IssueMetadataDto>) => {
      state.isLoading = false;
      state.metadata = action.payload;
      state.error = null;
    },
    fetchMetadataError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setFilters: (state, action: PayloadAction<IssueFiltersDto>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentIssue: (state) => {
      state.currentIssue = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const issueActions = issueSlice.actions;
export default issueSlice.reducer;
