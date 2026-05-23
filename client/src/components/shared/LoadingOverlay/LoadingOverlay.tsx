import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

interface LoadingOverlayProps {
  loading: boolean;
  message?: string;
  minHeight?: number | string;
  children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  loading,
  message,
  minHeight = 200,
  children,
}) => {
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight,
          gap: 2,
        }}
      >
        <CircularProgress />
        {message && (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  return <>{children}</>;
};

export default LoadingOverlay;
