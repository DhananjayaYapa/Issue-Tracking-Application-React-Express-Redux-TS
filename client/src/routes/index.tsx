import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { APP_ROUTES, USER_ROLES } from "../utilities/constants";
import PrivateRoute from "./PrivateRoute";
import { AppLayout } from "../templates";
import AuthPage from "../pages/AuthPage/AuthPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import Issues from "../pages/Issues/Issues";
import MyIssues from "../pages/MyIssues/MyIssues";
import Users from "../pages/Users/Users";
import IssueReport from "../pages/IssueReport/IssueReport";
import Profile from "../pages/Profile/Profile";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path={APP_ROUTES.LOGIN}
        element={<AuthPage initialPanel="login" />}
      />
      <Route
        path={APP_ROUTES.REGISTER}
        element={<AuthPage initialPanel="register" />}
      />

      {/* Routes for all authenticated users */}
      <Route
        path={APP_ROUTES.DASHBOARD}
        element={
          <PrivateRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.USER]}>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Admin-only Routes */}
      <Route
        path={APP_ROUTES.ISSUES}
        element={
          <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AppLayout>
              <Issues />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path={APP_ROUTES.USERS}
        element={
          <PrivateRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <AppLayout>
              <Users />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* User-only Routes */}
      <Route
        path={APP_ROUTES.MY_ISSUES}
        element={
          <PrivateRoute allowedRoles={[USER_ROLES.USER]}>
            <AppLayout>
              <MyIssues />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Available to both roles */}
      <Route
        path={APP_ROUTES.REPORT}
        element={
          <PrivateRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.USER]}>
            <AppLayout>
              <IssueReport />
            </AppLayout>
          </PrivateRoute>
        }
      />

      <Route
        path={APP_ROUTES.PROFILE}
        element={
          <PrivateRoute allowedRoles={[USER_ROLES.ADMIN, USER_ROLES.USER]}>
            <AppLayout>
              <Profile />
            </AppLayout>
          </PrivateRoute>
        }
      />

      {/* Root redirect */}
      <Route
        path={APP_ROUTES.ROOT}
        element={<Navigate to={APP_ROUTES.LOGIN} replace />}
      />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to={APP_ROUTES.LOGIN} replace />} />
    </Routes>
  );
};

export default AppRoutes;
