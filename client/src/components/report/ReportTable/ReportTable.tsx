import React from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TablePagination,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import {
  Download as DownloadIcon,
  Description as CsvIcon,
  DataObject as JsonIcon,
} from "@mui/icons-material";
import { StatusChip } from "../../shared";
import type { IssueStatus, IssuePriority } from "../../../utilities/models";
import { formatDate } from "../../../utilities/helpers/commonFunctions";
import { APP_TABLE_CONFIG } from "../../../utilities/constants";
import { paginationSx, StyledTableCell, StyledTableRow } from "../../../assets/theme/theme";

interface ReportIssue {
  id: number;
  title: string;
  description: string | null;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: string | { name?: string };
  createdAt: string;
  resolvedAt?: string | null;
}

interface ReportTableProps {
  reportData: ReportIssue[];
  page: number;
  rowsPerPage: number;
  anchorEl: HTMLElement | null;
  downloadMenuOpen: boolean;
  onPageChange: (event: unknown, newPage: number) => void;
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenDownloadMenu: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onCloseDownloadMenu: () => void;
  onDownloadCsv: () => void;
  onDownloadJson: () => void;
}

const ReportTable: React.FC<ReportTableProps> = ({
  reportData,
  page,
  rowsPerPage,
  anchorEl,
  downloadMenuOpen,
  onPageChange,
  onRowsPerPageChange,
  onOpenDownloadMenu,
  onCloseDownloadMenu,
  onDownloadCsv,
  onDownloadJson,
}) => {
  const paginatedData = reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Paper sx={{ mt: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            pb: 0,
          }}
        >
          <Typography variant="subtitle1" fontWeight={600}>
            Results ({reportData.length} {reportData.length === 1 ? "issue" : "issues"})
          </Typography>
          {reportData.length > 0 && (
            <>
              <Button variant="outlined" startIcon={<DownloadIcon />} onClick={onOpenDownloadMenu} sx={{ mb: "8px" }}>
                Download
              </Button>
              <Menu anchorEl={anchorEl} open={downloadMenuOpen} onClose={onCloseDownloadMenu}>
                <MenuItem onClick={onDownloadCsv}>
                  <ListItemIcon>
                    <CsvIcon fontSize="small" sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText>Download CSV</ListItemText>
                </MenuItem>
                <MenuItem onClick={onDownloadJson}>
                  <ListItemIcon>
                    <JsonIcon fontSize="small" sx={{ color: "white" }} />
                  </ListItemIcon>
                  <ListItemText>Download JSON</ListItemText>
                </MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <StyledTableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell>Title</StyledTableCell>
                <StyledTableCell>Description</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
                <StyledTableCell>Priority</StyledTableCell>
                <StyledTableCell>Created By</StyledTableCell>
                <StyledTableCell>Created At</StyledTableCell>
                <StyledTableCell>Resolved At</StyledTableCell>
              </StyledTableRow>
            </TableHead>
            <TableBody>
              {reportData.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={8} align="center">
                    <Typography color="text.secondary" py={4}>
                      No issues found for the selected filters
                    </Typography>
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                paginatedData.map((issue) => (
                  <StyledTableRow key={issue.id} hover>
                    <StyledTableCell>{issue.id}</StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2" sx={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {issue.title}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <Typography variant="body2" sx={{ maxWidth: 170, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {issue.description || "-"}
                      </Typography>
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip variant="status" value={issue.status} />
                    </StyledTableCell>
                    <StyledTableCell>
                      <StatusChip variant="priority" value={issue.priority} outlined />
                    </StyledTableCell>
                    <StyledTableCell>
                      {typeof issue.createdBy === "string" ? issue.createdBy : (issue.createdBy?.name ?? "-")}
                    </StyledTableCell>
                    <StyledTableCell>{formatDate(issue.createdAt)}</StyledTableCell>
                    <StyledTableCell>{issue.resolvedAt ? formatDate(issue.resolvedAt) : "-"}</StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {reportData.length > 0 && (
        <TablePagination
          component="div"
          count={reportData.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={APP_TABLE_CONFIG.ITEMS_PER_PAGE_OPTION}
          sx={paginationSx}
        />
      )}
    </>
  );
};

export default ReportTable;
