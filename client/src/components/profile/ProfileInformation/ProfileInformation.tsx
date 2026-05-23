import React from "react";
import { Paper, TextField, Button, Box, Typography, Alert, Divider, Avatar } from "@mui/material";
import { Person as PersonIcon, Save as SaveIcon } from "@mui/icons-material";

interface ProfileInformationProps {
  email: string;
  role: string;
  name: string;
  onNameChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  error: string | null;
}

const ProfileInformation: React.FC<ProfileInformationProps> = ({
  email,
  role,
  name,
  onNameChange,
  onSubmit,
  isLoading,
  error,
}) => {
  return (
    <Paper sx={{ p: 3, height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Avatar sx={{ bgcolor: "primary.main", width: 56, height: 56, mr: 2 }}>
          <PersonIcon sx={{ fontSize: 32 }} />
        </Avatar>
        <Box>
          <Typography variant="h6" fontWeight={600}>
            Profile Information
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update your personal details
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={onSubmit}>
        <TextField label="Email" value={email} fullWidth disabled sx={{ mb: 2 }} />
        <TextField label="Role" value={role} fullWidth disabled sx={{ mb: 2 }} />
        <TextField
          label="Name"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          fullWidth
          sx={{ mb: 3 }}
          placeholder="Enter your name"
        />
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={isLoading || !name.trim()}
          fullWidth
        >
          {isLoading ? "Saving..." : "Update Profile"}
        </Button>
      </form>
    </Paper>
  );
};

export default ProfileInformation;
