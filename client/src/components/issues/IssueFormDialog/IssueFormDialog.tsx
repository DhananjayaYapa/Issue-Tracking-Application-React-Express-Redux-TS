import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { AttachFile as AttachFileIcon } from "@mui/icons-material";
import type { SelectChangeEvent } from "@mui/material";
import { useAppSelector } from "../../../redux/store";
import type { IssueFormData } from "../../../utilities/models";

interface IssueFormDialogProps {
  open: boolean;
  onClose: () => void;
  isEditing: boolean;
  formData: IssueFormData;
  onChange: (property: string, value: string | number) => void;
  onSave: () => void;
  loading: boolean;
  hideStatus?: boolean;
}

const IssueFormDialog: React.FC<IssueFormDialogProps> = ({
  open,
  onClose,
  isEditing,
  formData,
  onChange,
  onSave,
  loading,
  hideStatus = false,
}) => {
  const metadata = useAppSelector((state) => state.issues.metadata);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>{isEditing ? "Edit Issue" : "Create New Issue"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title *"
                value={String(formData.title.value || "")}
                onChange={(e) => onChange("title", e.target.value)}
                error={!!formData.title.error}
                helperText={formData.title.error || `${String(formData.title.value || "").length}/100`}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description *"
                multiline
                rows={4}
                value={String(formData.description.value || "")}
                onChange={(e) => onChange("description", e.target.value)}
                error={!!formData.description.error}
                helperText={formData.description.error || `${String(formData.description.value || "").length}/500`}
              />
            </Grid>

            {isEditing && !hideStatus && (
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth error={!!formData.statusId.error}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={String(formData.statusId.value)}
                    label="Status"
                    onChange={(e: SelectChangeEvent) => onChange("statusId", Number(e.target.value))}
                  >
                    {(metadata?.statuses || []).map((status) => (
                      <MenuItem key={status.id} value={String(status.id)}>
                        {status.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} sm={4}>
              <FormControl fullWidth error={!!formData.priorityId.error}>
                <InputLabel>Priority</InputLabel>
                <Select
                  value={String(formData.priorityId.value)}
                  label="Priority"
                  onChange={(e: SelectChangeEvent) => onChange("priorityId", Number(e.target.value))}
                >
                  {(metadata?.priorities || []).map((priority) => (
                    <MenuItem key={priority.id} value={String(priority.id)}>
                      {priority.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : isEditing ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default IssueFormDialog;
