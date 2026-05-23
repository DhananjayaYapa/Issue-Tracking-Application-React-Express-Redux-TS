import React from "react";
import { Box, Paper, Grid, TextField, Typography, Button, CircularProgress } from "@mui/material";
import { FilterSelect } from "../../shared";

interface FilterOption {
  value: string;
  label: string;
}

interface ReportFiltersProps {
  fromDate: string;
  toDate: string;
  statusValue: string;
  priorityValue: string;
  createdByValue: string;
  statusOptions: FilterOption[];
  priorityOptions: FilterOption[];
  userOptions: FilterOption[];
  isAdmin: boolean;
  loading: boolean;
  onFromDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onStatusChange: (value: string) => void;
  onPriorityChange: (value: string) => void;
  onCreatedByChange: (value: string) => void;
  onViewReport: () => void;
  onReset: () => void;
}

const ReportFilters: React.FC<ReportFiltersProps> = ({
  fromDate,
  toDate,
  statusValue,
  priorityValue,
  createdByValue,
  statusOptions,
  priorityOptions,
  userOptions,
  isAdmin,
  loading,
  onFromDateChange,
  onToDateChange,
  onStatusChange,
  onPriorityChange,
  onCreatedByChange,
  onViewReport,
  onReset,
}) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" fontWeight={600} gutterBottom>
        Report Filters
      </Typography>
      <Grid container spacing={2} alignItems="center" mt={1}>
        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            fullWidth
            label="From Date"
            type="date"
            size="small"
            value={fromDate}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
            onChange={onFromDateChange}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <TextField
            fullWidth
            label="To Date"
            type="date"
            size="small"
            value={toDate}
            onChange={onToDateChange}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: today } }}
            InputLabelProps={{ shrink: true }}
            inputProps={{ min: fromDate || undefined }}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={2}>
          <FilterSelect
            label="Status"
            value={statusValue}
            options={statusOptions}
            onChange={onStatusChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={2}>
          <FilterSelect
            label="Priority"
            value={priorityValue}
            options={priorityOptions}
            onChange={onPriorityChange}
            fullWidth
          />
        </Grid>

        {isAdmin && (
          <Grid item xs={12} sm={6} lg={2}>
            <FilterSelect
              label="Created By"
              value={createdByValue}
              options={userOptions}
              onChange={onCreatedByChange}
              minWidth={140}
              fullWidth
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="contained" onClick={onViewReport} disabled={loading}>
          {loading ? <CircularProgress size={20} sx={{ mr: 1 }} /> : null}
          View Report
        </Button>
        <Button variant="contained" onClick={onReset} disabled={loading}>
          Reset
        </Button>
      </Box>
    </Paper>
  );
};

export default ReportFilters;
