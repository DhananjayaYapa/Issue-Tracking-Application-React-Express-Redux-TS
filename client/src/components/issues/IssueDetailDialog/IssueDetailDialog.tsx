import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
} from "@mui/icons-material";
import { StatusChip } from "../../shared";
import type { Issue } from "../../../utilities/models";
import { formatDate } from "../../../utilities/helpers/commonFunctions";

interface IssueDetailDialogProps {
  open: boolean;
  onClose: () => void;
  issue: (Issue & { attachment?: string | null }) | null;
}

const DetailRow: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <Box sx={{ display: "flex", mb: 1.5 }}>
    <Typography variant="body2" color="text.secondary" sx={{ minWidth: 120, fontWeight: 600 }}>
      {label}
    </Typography>
    <Box sx={{ flex: 1, minWidth: 0 }}>{children}</Box>
  </Box>
);

const IssueDetailDialog: React.FC<IssueDetailDialogProps> = ({ open, onClose, issue }) => {
  if (!issue) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        Issue Details
        <IconButton size="small" onClick={onClose}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ pt: 2 }}>
        <DetailRow label="Title">
          <Typography variant="body2" fontWeight={500} sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {issue.title}
          </Typography>
        </DetailRow>

        <DetailRow label="Description">
          <Typography variant="body2" sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {issue.description || "-"}
          </Typography>
        </DetailRow>

        <DetailRow label="Status">
          <StatusChip variant="status" value={issue.status} />
        </DetailRow>

        <DetailRow label="Priority">
          <StatusChip variant="priority" value={issue.priority} outlined />
        </DetailRow>

        <DetailRow label="Created By">
          <Typography variant="body2">{issue.createdBy.name}</Typography>
        </DetailRow>

        <DetailRow label="Created At">
          <Typography variant="body2">{formatDate(issue.createdAt)}</Typography>
        </DetailRow>

        <DetailRow label="Updated At">
          <Typography variant="body2">{formatDate(issue.updatedAt)}</Typography>
        </DetailRow>

        {issue.resolvedAt && (
          <DetailRow label="Resolved At">
            <Typography variant="body2">{formatDate(issue.resolvedAt)}</Typography>
          </DetailRow>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IssueDetailDialog;
