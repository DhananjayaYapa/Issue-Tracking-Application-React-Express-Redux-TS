import React from "react";
import { ROLE_FEATURES } from "../../../utilities/constants";

interface AppAuthorizerProps {
  userRole: string;
  authorizedRoles?: string[];
  authorizedFeatureKeys?: string[];
  authorizeCondition?: "AND" | "OR";
  children: React.ReactNode;
}

const AppAuthorizer: React.FC<AppAuthorizerProps> = ({
  userRole,
  authorizedRoles,
  authorizedFeatureKeys,
  authorizeCondition = "AND",
  children,
}) => {
  // Role-based authorization
  if (authorizedRoles && authorizedRoles.length > 0) {
    if (!authorizedRoles.includes(userRole)) {
      return null;
    }
  }

  // Feature-key-based authorization
  if (authorizedFeatureKeys && authorizedFeatureKeys.length > 0) {
    const roleFeatures = ROLE_FEATURES[userRole] || [];

    if (authorizeCondition === "OR") {
      const hasAnyPermission = authorizedFeatureKeys.some((key) =>
        roleFeatures.includes(key),
      );
      if (!hasAnyPermission) {
        return null;
      }
    } else {
      const hasAllPermissions = authorizedFeatureKeys.every((key) =>
        roleFeatures.includes(key),
      );
      if (!hasAllPermissions) {
        return null;
      }
    }
  }

  return <>{children}</>;
};

export default AppAuthorizer;
