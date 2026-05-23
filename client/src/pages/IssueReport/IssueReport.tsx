import React, { useState, useEffect } from "react";
import { Box, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { alertActions } from "../../redux/slices";
import { exportCsv, exportJson, fetchMetadata } from "../../redux/thunks";
import type { ExportFiltersDto, User } from "../../utilities/models";
import { ReportFilters, ReportTable } from "../../components/report";
import { userService, issueService } from "../../services";
import styles from "./IssueReport.module.scss";
import { USER_ROLES } from "../../utilities/constants";

const INITIAL_FILTERS_STATE: ExportFiltersDto = {};

const normalizeUsersPayload = (payload: unknown): User[] => {
  if (Array.isArray(payload)) return payload as User[];
  const data = payload as { items?: unknown; users?: unknown };
  if (Array.isArray(data?.items)) return data.items as User[];
  if (Array.isArray(data?.users)) return data.users as User[];
  return [];
};

const IssueReport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const metadata = useAppSelector((state) => state.issues.metadata);
  const alert = useAppSelector((state) => state.alert);

  const isAdmin = user?.role === USER_ROLES.ADMIN;

  const [filters, setFilters] = useState<ExportFiltersDto>(INITIAL_FILTERS_STATE);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportData, setReportData] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(false);
  const [viewed, setViewed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const downloadMenuOpen = Boolean(anchorEl);

  useEffect(() => {
    dispatch(fetchMetadata());
    if (isAdmin) {
      userService.getUsers().then((res) => {
        setUsers(normalizeUsersPayload(res.data.data));
      });
    }
    loadReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, isAdmin]);

  const statusOptions = (metadata?.statuses || []).map((s) => ({ value: String(s.id), label: s.name }));
  const priorityOptions = (metadata?.priorities || []).map((p) => ({ value: String(p.id), label: p.name }));

  const userOptions = users
    .map((u) => ({ value: String(u.id), label: u.name }))
    .sort((a, b) => a.label.localeCompare(b.label));

  const buildFilterParams = (): ExportFiltersDto => {
    const params: ExportFiltersDto = {};
    if (filters.statusId) params.statusId = filters.statusId;
    if (filters.priorityId) params.priorityId = filters.priorityId;
    if (fromDate) params.fromDate = fromDate;
    if (toDate) params.toDate = toDate;
    if (isAdmin && filters.createdBy) params.createdBy = filters.createdBy;
    return params;
  };

  const loadReport = async (overrideParams?: ExportFiltersDto) => {
    setLoading(true);
    setError(null);
    setViewed(true);
    setPage(0);
    try {
      const params = overrideParams !== undefined ? overrideParams : buildFilterParams();
      const response = await issueService.exportJson(params);
      const text = await (response.data as Blob).text();
      const json = JSON.parse(text);
      setReportData(Array.isArray(json?.issues) ? json.issues : Array.isArray(json) ? json : []);
    } catch {
      setError("Failed to load report");
      setReportData([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className={styles.reportPage}>
      <ReportFilters
        fromDate={fromDate}
        toDate={toDate}
        statusValue={filters.statusId ? String(filters.statusId) : ""}
        priorityValue={filters.priorityId ? String(filters.priorityId) : ""}
        createdByValue={filters.createdBy ? String(filters.createdBy) : ""}
        statusOptions={statusOptions}
        priorityOptions={priorityOptions}
        userOptions={userOptions}
        isAdmin={isAdmin}
        loading={loading}
        onFromDateChange={(e) => setFromDate(e.target.value)}
        onToDateChange={(e) => setToDate(e.target.value)}
        onStatusChange={(value) => setFilters((prev) => ({ ...prev, statusId: value ? Number(value) : undefined }))}
        onPriorityChange={(value) => setFilters((prev) => ({ ...prev, priorityId: value ? Number(value) : undefined }))}
        onCreatedByChange={(value) => setFilters((prev) => ({ ...prev, createdBy: value ? Number(value) : undefined }))}
        onViewReport={() => loadReport()}
        onReset={() => {
          setFilters(INITIAL_FILTERS_STATE);
          setFromDate("");
          setToDate("");
          setReportData([]);
          setViewed(false);
          setError(null);
          loadReport(INITIAL_FILTERS_STATE);
        }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {alert?.message && (
        <Alert severity={alert.severity ?? "info"} onClose={() => dispatch(alertActions.clearAlert())} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      {viewed && !loading && (
        <ReportTable
          reportData={reportData as never[]}
          page={page}
          rowsPerPage={rowsPerPage}
          anchorEl={anchorEl}
          downloadMenuOpen={downloadMenuOpen}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          onOpenDownloadMenu={(e) => setAnchorEl(e.currentTarget)}
          onCloseDownloadMenu={() => setAnchorEl(null)}
          onDownloadCsv={() => {
            setAnchorEl(null);
            dispatch(exportCsv(buildFilterParams()));
          }}
          onDownloadJson={() => {
            setAnchorEl(null);
            dispatch(exportJson(buildFilterParams()));
          }}
        />
      )}
    </Box>
  );
};

export default IssueReport;
