import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
  IconButton,
  Tooltip,
  Box,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import type { SelectChangeEvent } from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Close as CloseIcon,
  RadioButtonUnchecked as OpenIcon,
  Autorenew as InProgressIcon,
  CheckCircleOutline as ResolvedIcon,
  HighlightOff as ClosedIcon,
  ArrowDownward as LowIcon,
  ArrowForward as MediumIcon,
  ArrowUpward as HighIcon,
  PriorityHigh as CriticalIcon,
} from "@mui/icons-material";
import { StatusChip, LoadingOverlay } from "../../shared";
import type { Issue } from "../../../utilities/models";
import { getStatusIcon, getPriorityIcon, formatDate } from "../../../utilities/helpers/commonFunctions";
import { StyledTableCell, StyledTableRow } from "../../../assets/theme/theme";
import { useAppSelector } from "../../../redux/store";

interface IssueTableProps {
  issues: Issue[];
  loading: boolean;
  onEdit: (issue: Issue) => void;
  onDelete: (id: number) => void;
  onView?: (issue: Issue) => void;
  onStatusChange?: (issueId: number, statusId: number) => void;
  editingStatusId?: number | null;
  onEditStatusToggle?: (issueId: number | null) => void;
  showActions?: boolean;
  showStatusIcons?: boolean;
  showPriorityIcons?: boolean;
  onToggleStatusIcons?: () => void;
  onTogglePriorityIcons?: () => void;
  disableEditDelete?: boolean;
  children?: React.ReactNode;
}

const IssueTable: React.FC<IssueTableProps> = ({
  issues,
  loading,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
  editingStatusId = null,
  onEditStatusToggle,
  showActions = true,
  showStatusIcons = false,
  showPriorityIcons = false,
  onToggleStatusIcons,
  onTogglePriorityIcons,
  disableEditDelete = false,
  children,
}) => {
  const metadata = useAppSelector((state) => state.issues.metadata);

  return (
    <>
      <Box
        sx={{
          mt: 2,
          mb: 1,
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            fontSize: "0.75rem",
            color: "text.secondary",
          }}
        >
          {showStatusIcons && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                Status:
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <OpenIcon fontSize="inherit" color="info" /> - Open
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <InProgressIcon fontSize="inherit" color="warning" /> - In Progress
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ResolvedIcon fontSize="inherit" color="success" /> - Resolved
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <ClosedIcon fontSize="inherit" color="disabled" /> - Closed
              </Box>
            </Box>
          )}

          {showPriorityIcons && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
                Priority:
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LowIcon fontSize="inherit" color="success" /> - Low
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <MediumIcon fontSize="inherit" color="warning" /> - Medium
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <HighIcon fontSize="inherit" color="error" /> - High
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <CriticalIcon fontSize="inherit" color="error" /> - Critical
              </Box>
            </Box>
          )}
        </Box>

        {(onToggleStatusIcons || onTogglePriorityIcons) && (
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            {onToggleStatusIcons && (
              <FormControlLabel
                control={
                  <Switch checked={showStatusIcons} onChange={onToggleStatusIcons} size="small" color="primary" />
                }
                label="Status Icons"
                sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
              />
            )}
            {onTogglePriorityIcons && (
              <FormControlLabel
                control={
                  <Switch checked={showPriorityIcons} onChange={onTogglePriorityIcons} size="small" color="primary" />
                }
                label="Priority Icons"
                sx={{ "& .MuiFormControlLabel-label": { fontSize: "0.875rem" } }}
              />
            )}
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <LoadingOverlay loading={loading} minHeight={300}>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>Owner</StyledTableCell>
                <StyledTableCell>Created</StyledTableCell>
                <StyledTableCell>Resolved At</StyledTableCell>
                {showActions && <StyledTableCell align="right">Actions</StyledTableCell>}
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {issues?.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={showActions ? 7 : 6} align="center">
                    <Typography color="text.secondary" py={4}>
                      No issues found
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                issues?.map((issue) => {
                  const selectedStatusId =
                    metadata?.statuses.find((s) => s.name === issue.status)?.id ?? "";

                  return (
                    <StyledTableRow key={issue.id} hover>
                      <StyledTableCell>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {issue.title}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        <Typography
                          variant="body2"
                          fontWeight={500}
                          sx={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                        >
                          {issue.description}
                        </Typography>
                      </StyledTableCell>
                      <StyledTableCell>
                        {editingStatusId === issue.id ? (
                          <Select
                            size="small"
                            value={String(selectedStatusId)}
                            onChange={(e: SelectChangeEvent) => {
                              onStatusChange?.(issue.id, Number(e.target.value));
                            }}
                            sx={{ minWidth: 140 }}
                          >
                            {(metadata?.statuses || []).map((status) => (
                              <MenuItem key={status.id} value={String(status.id)}>
                                {status.name}
                              </MenuItem>
                            ))}
                          </Select>
                        ) : showStatusIcons ? (
                          <Tooltip title={issue.status}>
                            <IconButton size="small">{getStatusIcon(issue.status)}</IconButton>
                          </Tooltip>
                        ) : (
                          <StatusChip variant="status" value={issue.status} />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>
                        {showPriorityIcons ? (
                          <Tooltip title={issue.priority}>
                            <IconButton size="small">{getPriorityIcon(issue.priority)}</IconButton>
                          </Tooltip>
                        ) : (
                          <StatusChip variant="priority" value={issue.priority} outlined />
                        )}
                      </StyledTableCell>
                      <StyledTableCell>{issue.createdBy.name}</StyledTableCell>
                      <StyledTableCell>{formatDate(issue.createdAt)}</StyledTableCell>
                      <StyledTableCell>{issue.resolvedAt ? formatDate(issue.resolvedAt) : "-"}</StyledTableCell>
                      {showActions && (
                        <StyledTableCell align="right">
                          {editingStatusId === issue.id ? (
                            <Tooltip title="Cancel">
                              <IconButton size="small" onClick={() => onEditStatusToggle?.(null)}>
                                <CloseIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              title={
                                disableEditDelete
                                  ? "Your account is disabled"
                                  : issue.status === "Closed"
                                    ? "Closed"
                                    : "Edit Status"
                              }
                            >
                              <span>
                                <IconButton
                                  size="small"
                                  color="primary"
                                  disabled={issue.status === "Closed" || disableEditDelete}
                                  onClick={() =>
                                    onEditStatusToggle ? onEditStatusToggle(issue.id) : onEdit(issue)
                                  }
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </span>
                            </Tooltip>
                          )}
                          {onView && (
                            <Tooltip title="View">
                              <IconButton size="small" color="primary" onClick={() => onView(issue)}>
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                          <Tooltip title={disableEditDelete ? "Your account is disabled" : "Delete"}>
                            <span>
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => onDelete(issue.id)}
                                disabled={disableEditDelete}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </span>
                          </Tooltip>
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </LoadingOverlay>
      </TableContainer>
      {children}
    </>
  );
};

export default IssueTable;
