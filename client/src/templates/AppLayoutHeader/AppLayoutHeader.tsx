import { Link, Typography, Box } from "@mui/material";
import { useLocation, Link as RouterLink } from "react-router-dom";
import { APP_ROUTES } from "../../utilities/constants";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { AppBreadcrumb } from "../../assets/theme/theme";

const ROUTE_META: Record<string, { title: string; breadcrumb: string }> = {
  [APP_ROUTES.DASHBOARD]: { title: "Dashboard", breadcrumb: "Dashboard" },
  [APP_ROUTES.ISSUES]: { title: "All Issues", breadcrumb: "All Issues" },
  [APP_ROUTES.MY_ISSUES]: { title: "My Issues", breadcrumb: "My Issues" },
  [APP_ROUTES.USERS]: { title: "Users", breadcrumb: "Users" },
  [APP_ROUTES.REPORT]: { title: "Report", breadcrumb: "Report" },
  [APP_ROUTES.PROFILE]: { title: "Profile", breadcrumb: "Profile" },
  [APP_ROUTES.ISSUE_CREATE]: {
    title: "Create Issue",
    breadcrumb: "Create Issue",
  },
};

const getDynamicMeta = (
  pathname: string,
): { title: string; breadcrumb: string } | null => {
  if (/^\/issues\/\d+\/edit$/.test(pathname)) {
    return { title: "Edit Issue", breadcrumb: "Edit Issue" };
  }
  if (/^\/issues\/\d+$/.test(pathname)) {
    return { title: "Issue Details", breadcrumb: "Issue Details" };
  }
  return null;
};

const AppLayoutHeader = () => {
  const location = useLocation();
  const pathname = location.pathname;

  const meta = ROUTE_META[pathname] ||
    getDynamicMeta(pathname) || { title: "", breadcrumb: "" };
  const isDashboard = pathname === APP_ROUTES.DASHBOARD;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flexGrow: 1,
      }}
    >
      {/* Page Title */}
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          fontSize: "18px",
          color: "#ffffff",
          lineHeight: 1.2,
        }}
      >
        {meta.title}
      </Typography>

      {/* Breadcrumb */}
      {!isDashboard && (
        <AppBreadcrumb
          separator={
            <NavigateNextIcon
              sx={{ fontSize: 14, color: "rgba(255,255,255,0.5)" }}
            />
          }
          aria-label="breadcrumb"
        >
          <Link
            component={RouterLink}
            to={APP_ROUTES.DASHBOARD}
            underline="hover"
            sx={{ fontSize: "12px", color: "rgba(255,255,255,0.6)" }}
          >
            Dashboard
          </Link>
          <Typography sx={{ fontSize: "12px", color: "rgba(255,255,255,0.9)" }}>
            {meta.breadcrumb}
          </Typography>
        </AppBreadcrumb>
      )}
    </Box>
  );
};

export default AppLayoutHeader;
