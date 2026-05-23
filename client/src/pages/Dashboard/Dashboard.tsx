import React, { useEffect } from "react";
import { Box, Grid, Card, CardContent, Typography, Divider, Button } from "@mui/material";
import {
  BugReport as OpenIcon,
  Autorenew as InProgressIcon,
  CheckCircle as ResolvedIcon,
  Cancel as ClosedIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  fetchIssues,
  fetchMyIssues,
  fetchStatusCounts,
  fetchMyStatusCounts,
} from "../../redux/thunks";
import { StatCard, WelcomeMessage, IssuesBarChart, IssuesPieChart } from "../../components/dashboard";
import { LoadingOverlay } from "../../components/shared";
import { APP_ROUTES, USER_ROLES } from "../../utilities/constants";
import styles from "./Dashboard.module.scss";

const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const issueState = useAppSelector((state) => state.issues);
  const user = useAppSelector((state) => state.auth.user);

  const isAdmin = user?.role === USER_ROLES.ADMIN;
  const counts = issueState.statusCounts;
  const issues = issueState.issues;
  const isLoading = issueState.isLoading;

  useEffect(() => {
    if (isAdmin) {
      dispatch(fetchStatusCounts());
      dispatch(fetchIssues());
    } else {
      dispatch(fetchMyStatusCounts());
      dispatch(fetchMyIssues());
    }
  }, [dispatch, isAdmin]);

  const handleViewDetails = () => {
    navigate(isAdmin ? APP_ROUTES.ISSUES : APP_ROUTES.MY_ISSUES);
  };

  const stats = [
    { title: "Open", count: counts?.Open || 0, icon: <OpenIcon fontSize="large" />, color: "#0288d1" },
    {
      title: "In Progress",
      count: counts?.["In Progress"] || 0,
      icon: <InProgressIcon fontSize="large" />,
      color: "#ed6c02",
    },
    { title: "Resolved", count: counts?.Resolved || 0, icon: <ResolvedIcon fontSize="large" />, color: "#2e7d32" },
    { title: "Closed", count: counts?.Closed || 0, icon: <ClosedIcon fontSize="large" />, color: "#757575" },
  ];

  return (
    <Box className={styles.dashboard}>
      <WelcomeMessage userName={user?.name} isAdmin={isAdmin} />
      <LoadingOverlay loading={isLoading} minHeight={200}>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={3} key={stat.title}>
              <StatCard {...stat} />
            </Grid>
          ))}
        </Grid>
      </LoadingOverlay>
      <Box className={styles.totalSection}>
        <Card>
          <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              <Typography variant="h6" gutterBottom>
                Total Issues
              </Typography>
              <Typography variant="h3" fontWeight={600} color="primary">
                {counts?.total || 0}
              </Typography>
            </Box>
            <Button variant="contained" size="large" onClick={handleViewDetails}>
              View Details
            </Button>
          </CardContent>
        </Card>
      </Box>
      <Divider />

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <IssuesBarChart issues={issues} />
        </Grid>
        <Grid item xs={12} md={6}>
          <IssuesPieChart statusCounts={counts} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
