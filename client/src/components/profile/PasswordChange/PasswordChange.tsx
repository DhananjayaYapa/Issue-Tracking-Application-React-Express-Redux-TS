import React from "react";
import { Paper, TextField, Button, Box, Typography, Divider, Avatar } from "@mui/material";
import { Lock as LockIcon } from "@mui/icons-material";
import type { PasswordFormData } from "../../../utilities/models";

interface PasswordChangeProps {
  formData: PasswordFormData;
  onFormChange: (property: keyof PasswordFormData, value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const PasswordChange: React.FC<PasswordChangeProps> = ({
  formData,
  onFormChange,
  onSubmit,
  isLoading,
}) => {
  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "warning.main", width: 56, height: 56, mr: 2 }}>
          <LockIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Change Password
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your account password
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <form onSubmit={onSubmit}>
        <TextField
          label="Current Password"
          type="password"
          value={formData.currentPassword.value}
          onChange={(e) => onFormChange("currentPassword", e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Enter current password"
          error={!!formData.currentPassword.error}
          helperText={formData.currentPassword.error}
        />
        <TextField
          label="New Password"
          type="password"
          value={formData.newPassword.value}
          onChange={(e) => onFormChange("newPassword", e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          placeholder="Enter new password"
          error={!!formData.newPassword.error}
          helperText={formData.newPassword.error}
        />
        <TextField
          label="Confirm New Password"
          type="password"
          value={formData.confirmPassword.value}
          onChange={(e) => onFormChange("confirmPassword", e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          placeholder="Confirm new password"
          error={!!formData.confirmPassword.error}
          helperText={formData.confirmPassword.error}
        />
        <Button
          type="submit"
          variant="contained"
          color="warning"
          startIcon={<LockIcon />}
          disabled={isLoading}
          fullWidth
        >
          {isLoading ? "Changing..." : "Change Password"}
        </Button>
      </form>
    </Paper>
  );
};

export default PasswordChange;
