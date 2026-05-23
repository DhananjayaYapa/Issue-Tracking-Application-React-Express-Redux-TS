import React, { useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Chip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  BugReport as BugIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  People as PeopleIcon,
  ChevronLeft as ChevronLeftIcon,
  Assessment as ReportIcon,
} from "@mui/icons-material";
import { logoutUser } from "../../redux/thunks";
import { APP_ROUTES, APP_CONFIG, USER_ROLES } from "../../utilities/constants";
import { AppAuthorizer } from "../../components/shared";
import { AppLayoutHeader } from "../index";
import styles from "./AppLayout.module.scss";

const DRAWER_WIDTH = 240;
const DRAWER_WIDTH_COLLAPSED = 64;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  allowedRoles?: string[];
}

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: APP_ROUTES.DASHBOARD,
    icon: <DashboardIcon />,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "All Issues",
    path: APP_ROUTES.ISSUES,
    icon: <BugIcon />,
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    label: "Users",
    path: APP_ROUTES.USERS,
    icon: <PeopleIcon />,
    allowedRoles: [USER_ROLES.ADMIN],
  },
  {
    label: "My Issues",
    path: APP_ROUTES.MY_ISSUES,
    icon: <BugIcon />,
    allowedRoles: [USER_ROLES.USER],
  },
  {
    label: "Report",
    path: APP_ROUTES.REPORT,
    icon: <ReportIcon />,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
  {
    label: "Profile",
    path: APP_ROUTES.PROFILE,
    icon: <PersonIcon />,
    allowedRoles: [USER_ROLES.ADMIN, USER_ROLES.USER],
  },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    dispatch(logoutUser());
    navigate(APP_ROUTES.LOGIN);
  };

  const drawerWidth = collapsed ? DRAWER_WIDTH_COLLAPSED : DRAWER_WIDTH;

  const drawerContent = (
    <Box className={styles.drawerContent}>
      {/* Logo Section */}
      <Box className={styles.logoSection}>
        <BugIcon sx={{ fontSize: 32, color: "primary.main" }} />
        {!collapsed && (
          <Typography variant="h6" fontWeight={600} sx={{ ml: 1 }}>
            {APP_CONFIG.APP_NAME}
          </Typography>
        )}
        {!isMobile && (
          <IconButton
            onClick={handleDrawerToggle}
            size="small"
            sx={{ ml: "auto" }}
          >
            <ChevronLeftIcon
              sx={{
                transform: collapsed ? "rotate(180deg)" : "none",
                transition: "transform 0.3s",
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Navigation */}
      <List sx={{ flex: 1, pt: 2 }}>
        {navItems.map((item) => (
          <AppAuthorizer
            key={item.path}
            userRole={user?.role || USER_ROLES.USER}
            authorizedRoles={item.allowedRoles}
          >
            <ListItem disablePadding sx={{ display: "block" }}>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? "center" : "initial",
                  px: 2.5,
                  borderRadius: 2,
                  mx: 1,
                  mb: 0.5,
                  "&.Mui-selected": {
                    bgcolor: "rgba(20, 18, 50, 0.85)",
                    color: "white",
                    "& .MuiListItemIcon-root": { color: "white" },
                    "&:hover": { bgcolor: "#141413" },
                  },
                }}
                onClick={() => isMobile && setMobileOpen(false)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          </AppAuthorizer>
        ))}
      </List>

      {/* User Section */}
      <Box className={styles.userSection}>
        <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </Avatar>
        {!collapsed && (
          <Box sx={{ ml: 1, overflow: "hidden" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Typography variant="body2" fontWeight={500} noWrap>
                {user?.name || "User"}
              </Typography>
              <Chip
                label={user?.role || USER_ROLES.USER}
                size="small"
                color={user?.role === USER_ROLES.ADMIN ? "primary" : "default"}
                variant="outlined"
                sx={{ height: 18, fontSize: "0.65rem" }}
              />
            </Box>
            <Typography variant="caption" color="text.secondary" noWrap>
              {user?.email || ""}
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", overflow: "scroll" }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: "rgba(20, 18, 50, 0.85)",
          backdropFilter: "blur(8px)",
          color: "#ffffff",
          boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <Toolbar>
          <IconButton
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <AppLayoutHeader />

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: "primary.main" }}>
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate(APP_ROUTES.PROFILE);
              }}
            >
              <ListItemIcon>
                <PersonIcon fontSize="small" sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              Profile
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{ color: "#ffffff" }} />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: DRAWER_WIDTH,
              background: "rgba(20, 18, 50, 0.85)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              background: "linear-gradient(#29273F, #861d13)",
              borderRight: "1px solid rgba(255, 255, 255, 0.1)",
              transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: "64px",
          height: "calc(100vh - 64px)",
          overflow: "auto",
          background: "linear-gradient(#29273F, #B61A0B)",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default AppLayout;
