import React from "react";
import { Box, Card, CardContent, Typography } from "@mui/material";
import styles from "./StatCard.module.scss";

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, icon, color }) => {
  return (
    <Card className={styles.statCard}>
      <CardContent>
        <Box className={styles.statContent}>
          <Box className={styles.iconBox} sx={{ backgroundColor: `${color}15`, color }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="h4" fontWeight={600}>
              {count}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;
