import React, { useEffect, useState } from "react";
import { Box, Alert, TablePagination } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { alertActions } from "../../redux/slices";
import {
  fetchIssues,
  fetchMetadata,
  updateIssueStatus,
  deleteIssue,
} from "../../redux/thunks";
import type { Issue, IssueFiltersDto, IssueStatus, User } from "../../utilities/models";
import { ConfirmationDialog } from "../../components/shared";
import { IssueTable, IssueFilters, IssueDetailDialog } from "../../components/issues";
import { userService } from "../../services";
import styles from "./Issues.module.scss";
import { APP_TABLE_CONFIG } from "../../utilities/constants";
import { paginationSx } from "../../assets/theme/theme";

const INITIAL_FILTERS_STATE: IssueFiltersDto = {};

const normalizeUsersPayload = (payload: unknown): User[] => {
  if (Array.isArray(payload)) return payload as User[];
  const data = payload as { items?: unknown; users?: unknown };
  if (Array.isArray(data?.items)) return data.items as User[];
  if (Array.isArray(data?.users)) return data.users as User[];
  return [];
};

const Issues: React.FC = () => {
  const dispatch = useAppDispatch();

  const issueState = useAppSelector((state) => state.issues);
  const alert = useAppSelector((state) => state.alert);
  const { issues, isLoading, error } = issueState;

  const [pendingFilters, setPendingFilters] = useState<IssueFiltersDto>(INITIAL_FILTERS_STATE);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [createdByValue, setCreatedByValue] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<IssueFiltersDto>(INITIAL_FILTERS_STATE);
  const [users, setUsers] = useState<User[]>([]);
  const [editingStatusId, setEditingStatusId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIssueId, setDeleteIssueId] = useState<number | null>(null);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ issueId: number; statusId: number; statusName: IssueStatus } | null>(null);
  const [showStatusIcons, setShowStatusIcons] = useState(false);
  const [showPriorityIcons, setShowPriorityIcons] = useState(false);
  const [viewIssue, setViewIssue] = useState<(Issue & { attachment?: string | null }) | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  const metadata = issueState.metadata;

  const filteredIssues = issues.filter((issue) => {
    if (!searchInput.trim()) return true;
    const searchTerm = searchInput.trim().toLowerCase();
    return (
      issue.title.toLowerCase().includes(searchTerm) ||
      issue.description?.toLowerCase().includes(searchTerm) ||
      issue.status.toLowerCase().includes(searchTerm) ||
      issue.priority.toLowerCase().includes(searchTerm) ||
      issue.createdBy.name.toLowerCase().includes(searchTerm)
    );
  });

  const paginatedData = filteredIssues.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  useEffect(() => {
    dispatch(fetchIssues({ filters: appliedFilters }));
    dispatch(fetchMetadata());
    userService.getUsers().then((res) => {
      setUsers(normalizeUsersPayload(res.data.data));
    });
  }, [dispatch, appliedFilters]);

  const userOptions = users
    .map((u) => ({ value: String(u.id), label: u.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const handleApplyFilters = () => {
    setAppliedFilters({
      ...pendingFilters,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
      createdBy: createdByValue ? Number(createdByValue) : undefined,
    });
  };

  const handleResetFilters = () => {
    setPendingFilters(INITIAL_FILTERS_STATE);
    setFromDate("");
    setToDate("");
    setCreatedByValue("");
    setAppliedFilters(INITIAL_FILTERS_STATE);
    setSearchInput("");
  };

  const handleFilterChange = (key: keyof IssueFiltersDto, value: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value ? Number(value) : undefined,
    }));
  };

  const handleStatusChange = (issueId: number, statusId: number) => {
    const statusName = metadata?.statuses.find((s) => s.id === statusId)?.name as IssueStatus;
    setPendingStatusChange({ issueId, statusId, statusName });
    setStatusDialogOpen(true);
  };

  const handleConfirmStatusChange = () => {
    if (pendingStatusChange) {
      dispatch(updateIssueStatus({ id: pendingStatusChange.issueId, statusId: pendingStatusChange.statusId }));
      setEditingStatusId(null);
    }
    setStatusDialogOpen(false);
    setPendingStatusChange(null);
  };

  const handleOpenDelete = (id: number) => {
    setDeleteIssueId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteIssueId) {
      dispatch(deleteIssue({ id: deleteIssueId }));
    }
    setDeleteDialogOpen(false);
    setDeleteIssueId(null);
  };

  return (
    <Box className={styles.issuesPage}>
      {alert?.message && (
        <Alert severity={alert.severity ?? "info"} onClose={() => dispatch(alertActions.clearAlert())} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <IssueFilters
        filters={pendingFilters}
        fromDate={fromDate}
        toDate={toDate}
        onFromDateChange={setFromDate}
        onToDateChange={setToDate}
        onFilterChange={handleFilterChange}
        onApply={handleApplyFilters}
        onReset={handleResetFilters}
        loading={isLoading}
        showCreatedBy
        userOptions={userOptions}
        createdByValue={createdByValue}
        onCreatedByChange={setCreatedByValue}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <IssueTable
        issues={paginatedData}
        loading={isLoading}
        onEdit={() => undefined}
        onDelete={handleOpenDelete}
        onView={setViewIssue}
        onStatusChange={handleStatusChange}
        editingStatusId={editingStatusId}
        onEditStatusToggle={setEditingStatusId}
        showActions
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
        onToggleStatusIcons={() => setShowStatusIcons(!showStatusIcons)}
        onTogglePriorityIcons={() => setShowPriorityIcons(!showPriorityIcons)}
      >
        {filteredIssues.length > 0 && (
          <TablePagination
            component="div"
            count={filteredIssues.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={APP_TABLE_CONFIG.ITEMS_PER_PAGE_OPTION}
            sx={paginationSx}
          />
        )}
      </IssueTable>

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <ConfirmationDialog
        open={statusDialogOpen}
        title="Change Status"
        message={`Are you sure you want to change the status to "${pendingStatusChange?.statusName}"?`}
        confirmLabel="Confirm"
        confirmColor="primary"
        onConfirm={handleConfirmStatusChange}
        onCancel={() => setStatusDialogOpen(false)}
      />

      <IssueDetailDialog open={!!viewIssue} onClose={() => setViewIssue(null)} issue={viewIssue} />
    </Box>
  );
};

export default Issues;
