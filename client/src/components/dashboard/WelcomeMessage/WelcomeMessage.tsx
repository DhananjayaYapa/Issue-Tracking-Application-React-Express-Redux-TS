import React from "react";
import { Box, Typography } from "@mui/material";

interface WelcomeMessageProps {
  userName?: string;
  isAdmin?: boolean;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ userName = "User", isAdmin = false }) => {
  const firstName = isAdmin ? userName : userName.split(" ")[0] || userName;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h4" fontWeight={600} color="#ffffff">
        Welcome back, {firstName}!
      </Typography>
    </Box>
  );
};

export default WelcomeMessage;
