import React, { useEffect, useState } from "react";
import { Box, Alert, TablePagination } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { alertActions } from "../../redux/slices";
import {
  fetchMyIssues,
  fetchMetadata,
  createIssue,
  updateIssue,
  deleteIssue,
} from "../../redux/thunks";
import type {
  Issue,
  IssueFiltersDto,
  CreateIssuePayload,
  IssueFormData,
  UpdateIssuePayload,
} from "../../utilities/models";
import { PageHeader, ConfirmationDialog } from "../../components/shared";
import {
  IssueTable,
  IssueFilters,
  IssueFormDialog,
  IssueDetailDialog,
} from "../../components/issues";
import styles from "./MyIssues.module.scss";
import { validateFormData } from "../../utilities/helpers/formValidator";
import { APP_TABLE_CONFIG } from "../../utilities/constants";
import { paginationSx } from "../../assets/theme/theme";

const ISSUE_INITIAL_STATE: IssueFormData = {
  title: {
    value: "",
    validator: "text",
    isRequired: true,
    minLength: 3,
    maxLength: 100,
    error: null,
  },
  description: {
    value: "",
    validator: "text",
    isRequired: true,
    minLength: 3,
    maxLength: 500,
    error: null,
  },
  statusId: { value: 1, validator: "number", isRequired: true, error: null },
  priorityId: { value: 2, validator: "number", isRequired: true, error: null },
};

const INITIAL_FILTERS_STATE: IssueFiltersDto = {};

const MyIssues: React.FC = () => {
  const dispatch = useAppDispatch();

  const issueState = useAppSelector((state) => state.issues);
  const { issues, isLoading, error, metadata } = issueState;
  const currentUser = useAppSelector((state) => state.auth.user);
  const alert = useAppSelector((state) => state.alert);

  const isUserDisabled = currentUser?.isEnabled === false;

  const [pendingFilters, setPendingFilters] = useState<IssueFiltersDto>(
    INITIAL_FILTERS_STATE,
  );
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<IssueFiltersDto>(
    INITIAL_FILTERS_STATE,
  );
  const [appliedFromDate, setAppliedFromDate] = useState("");
  const [appliedToDate, setAppliedToDate] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [currentIssue, setCurrentIssue] = useState<Issue | null>(null);
  const [issueFormData, setIssueFormData] =
    useState<IssueFormData>(ISSUE_INITIAL_STATE);
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIssueId, setDeleteIssueId] = useState<number | null>(null);
  const [showStatusIcons, setShowStatusIcons] = useState(false);
  const [showPriorityIcons, setShowPriorityIcons] = useState(false);
  const [viewIssue, setViewIssue] = useState<
    (Issue & { attachment?: string | null }) | null
  >(null);
  const [searchInput, setSearchInput] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);

  useEffect(() => {
    dispatch(fetchMyIssues({ filters: appliedFilters }));
    dispatch(fetchMetadata());
  }, [dispatch, appliedFilters]);

  const filteredIssues = issues.filter((issue) => {
    let match = true;

    if (pendingFilters.statusId && metadata?.statuses) {
      const statusName = metadata.statuses.find(
        (s) => s.id === pendingFilters.statusId,
      )?.name;
      if (statusName && issue.status !== statusName) match = false;
    }

    if (pendingFilters.priorityId && metadata?.priorities) {
      const priorityName = metadata.priorities.find(
        (p) => p.id === pendingFilters.priorityId,
      )?.name;
      if (priorityName && issue.priority !== priorityName) match = false;
    }

    if (appliedFromDate) {
      const issueDate = new Date(issue.createdAt);
      if (issueDate < new Date(appliedFromDate)) match = false;
    }

    if (appliedToDate) {
      const issueDate = new Date(issue.createdAt);
      const end = new Date(appliedToDate);
      end.setHours(23, 59, 59, 999);
      if (issueDate > end) match = false;
    }

    if (searchInput.trim()) {
      const searchTerm = searchInput.trim().toLowerCase();
      const searchMatch =
        issue.title.toLowerCase().includes(searchTerm) ||
        issue.description?.toLowerCase().includes(searchTerm) ||
        issue.status.toLowerCase().includes(searchTerm) ||
        issue.priority.toLowerCase().includes(searchTerm) ||
        issue.createdBy.name.toLowerCase().includes(searchTerm);
      if (!searchMatch) match = false;
    }

    return match;
  });

  const paginatedData = filteredIssues.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage,
  );

  const handleApplyFilters = () => {
    setAppliedFilters({ ...pendingFilters });
    setAppliedFromDate(fromDate);
    setAppliedToDate(toDate);
  };

  const handleResetFilters = () => {
    setPendingFilters(INITIAL_FILTERS_STATE);
    setFromDate("");
    setToDate("");
    setAppliedFilters(INITIAL_FILTERS_STATE);
    setAppliedFromDate("");
    setAppliedToDate("");
    setSearchInput("");
  };

  const handleFilterChange = (key: keyof IssueFiltersDto, value: string) => {
    setPendingFilters((prev) => ({
      ...prev,
      [key]: value ? Number(value) : undefined,
    }));
  };

  const handleOpenCreate = () => {
    setCurrentIssue(null);
    setIssueFormData(ISSUE_INITIAL_STATE);
    setAttachmentFile(null);
    setFormOpen(true);
  };

  const handleOpenEdit = (issue: Issue) => {
    const statusId =
      metadata?.statuses.find((s) => s.name === issue.status)?.id || 1;
    const priorityId =
      metadata?.priorities.find((p) => p.name === issue.priority)?.id || 2;

    setCurrentIssue(issue);
    setIssueFormData({
      title: { ...ISSUE_INITIAL_STATE.title, value: issue.title },
      description: {
        ...ISSUE_INITIAL_STATE.description,
        value: issue.description || "",
      },
      statusId: { ...ISSUE_INITIAL_STATE.statusId, value: statusId },
      priorityId: { ...ISSUE_INITIAL_STATE.priorityId, value: priorityId },
    });
    setAttachmentFile(null);
    setFormOpen(true);
  };

  const handleSaveIssue = async () => {
    const [validatedData, isValid] = await validateFormData(issueFormData);
    setIssueFormData(validatedData as IssueFormData);

    if (!isValid) return;

    if (currentIssue) {
      const updatePayload: UpdateIssuePayload = {
        id: currentIssue.id,
        title: validatedData.title.value,
        description: validatedData.description.value,
        priorityId: Number(validatedData.priorityId.value),
      };

      dispatch(updateIssue(updatePayload));
    } else {
      const createPayload: CreateIssuePayload = {
        title: validatedData.title.value,
        description: validatedData.description.value,
        priorityId: Number(validatedData.priorityId.value),
      };

      // New issues always start in Open status on server-v2.
      dispatch(createIssue(createPayload));
    }

    setFormOpen(false);
    setCurrentIssue(null);
    setIssueFormData(ISSUE_INITIAL_STATE);
    setAttachmentFile(null);
  };

  return (
    <Box className={styles.myIssuesPage}>
      <PageHeader
        actionLabel="New Issue"
        actionIcon={<AddIcon />}
        onAction={handleOpenCreate}
        actionDisabled={isUserDisabled}
      />

      {isUserDisabled && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Your account has been disabled. You cannot create, edit, or delete
          issues.
        </Alert>
      )}

      {alert?.message && (
        <Alert
          severity={alert.severity ?? "info"}
          sx={{ mb: 2 }}
          onClose={() => dispatch(alertActions.clearAlert())}
        >
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
        onEdit={handleOpenEdit}
        onDelete={(id) => {
          setDeleteIssueId(id);
          setDeleteDialogOpen(true);
        }}
        onView={setViewIssue}
        showStatusIcons={showStatusIcons}
        showPriorityIcons={showPriorityIcons}
        onToggleStatusIcons={() => setShowStatusIcons(!showStatusIcons)}
        onTogglePriorityIcons={() => setShowPriorityIcons(!showPriorityIcons)}
        disableEditDelete={isUserDisabled}
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

      <IssueFormDialog
        open={formOpen}
        onClose={() => setFormOpen(false)}
        isEditing={!!currentIssue}
        formData={issueFormData}
        onChange={(property, value) => {
          setIssueFormData((prev) => ({
            ...prev,
            [property]: {
              ...prev[property as keyof IssueFormData],
              value,
              error: null,
            },
          }));
        }}
        onSave={handleSaveIssue}
        loading={isLoading}
        hideStatus
        attachment={attachmentFile}
        onAttachmentChange={setAttachmentFile}
        existingAttachment={null}
      />

      <ConfirmationDialog
        open={deleteDialogOpen}
        title="Delete Issue"
        message="Are you sure you want to delete this issue? This action cannot be undone."
        confirmLabel="Delete"
        confirmColor="error"
        onConfirm={() => {
          if (deleteIssueId) {
            dispatch(deleteIssue({ id: deleteIssueId }));
          }
          setDeleteDialogOpen(false);
          setDeleteIssueId(null);
        }}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      <IssueDetailDialog
        open={!!viewIssue}
        onClose={() => setViewIssue(null)}
        issue={viewIssue}
      />
    </Box>
  );
};

export default MyIssues;
