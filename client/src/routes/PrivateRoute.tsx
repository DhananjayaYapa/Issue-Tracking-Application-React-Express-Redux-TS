import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchProfile } from "../redux/thunks";
import { APP_ROUTES } from "../utilities/constants";

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  // Re-hydrate user profile on page refresh
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(fetchProfile());
    }
  }, [isAuthenticated, user, dispatch]);

  if (!isAuthenticated) {
    return (
      <Navigate to={APP_ROUTES.LOGIN} state={{ from: location }} replace />
    );
  }

  // Wait for user data before checking roles
  if (!user) {
    return null;
  }

  // Role-based access check
  if (allowedRoles && allowedRoles.length > 0) {
    if (!allowedRoles.includes(user.role)) {
      return <Navigate to={APP_ROUTES.DASHBOARD} replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
