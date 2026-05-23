import React from "react";
import { Box, Typography, Button } from "@mui/material";

interface PageHeaderProps {
  subtitle?: string;
  actionLabel?: string;
  actionIcon?: React.ReactNode;
  onAction?: () => void;
  actionDisabled?: boolean;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  subtitle,
  actionLabel,
  actionIcon,
  onAction,
  actionDisabled,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb: 3,
      }}
    >
      <Box>
        {subtitle && (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      {actionLabel && onAction && (
        <Button
          variant="contained"
          startIcon={actionIcon}
          onClick={onAction}
          disabled={actionDisabled}
        >
          {actionLabel}
        </Button>
      )}
    </Box>
  );
};

export default PageHeader;
