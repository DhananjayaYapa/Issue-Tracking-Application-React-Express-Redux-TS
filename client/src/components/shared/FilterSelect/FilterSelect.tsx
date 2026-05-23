import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

interface FilterSelectProps {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
  allLabel?: string;
  size?: "small" | "medium";
  minWidth?: number;
  disabled?: boolean;
  fullWidth?: boolean;
}

const FilterSelect: React.FC<FilterSelectProps> = ({
  label,
  value,
  options,
  onChange,
  allLabel = "All",
  size = "small",
  minWidth = 120,
  disabled = false,
  fullWidth = false,
}) => {
  const handleChange = (event: SelectChangeEvent) => {
    onChange(event.target.value);
  };

  return (
    <FormControl size={size} sx={{ minWidth }} disabled={disabled} fullWidth={fullWidth}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} label={label} onChange={handleChange} sx={{ borderRadius: 50 }}>
        <MenuItem value="">{allLabel}</MenuItem>
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
