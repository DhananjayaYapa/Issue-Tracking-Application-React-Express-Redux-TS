import React, { useState, useEffect } from "react";
import { Box, Grid2 as Grid, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { alertActions } from "../../redux/slices";
import { updateProfile, changePassword } from "../../redux/thunks";
import type { PasswordFormData } from "../../utilities/models";
import { validateFormData } from "../../utilities/helpers/formValidator";
import { ProfileInformation, PasswordChange } from "../../components/profile";
import styles from "./Profile.module.scss";

const PASSWORD_FORM_INITIAL_STATE: PasswordFormData = {
  currentPassword: { value: "", validator: "text", isRequired: true, error: null },
  newPassword: { value: "", validator: "text", isRequired: true, minLength: 6, error: null },
  confirmPassword: { value: "", validator: "text", isRequired: true, error: null },
};

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const alert = useAppSelector((state) => state.alert);

  const [name, setName] = useState("");
  const [passwordFormData, setPasswordFormData] = useState<PasswordFormData>(PASSWORD_FORM_INITIAL_STATE);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
    }
  }, [user]);

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    dispatch(updateProfile({ name: name.trim() }));
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const [validatedData, isValid] = await validateFormData(passwordFormData);

    if (
      validatedData.newPassword.value &&
      validatedData.confirmPassword.value &&
      validatedData.newPassword.value !== validatedData.confirmPassword.value
    ) {
      validatedData.confirmPassword.error = "Passwords do not match";
      setPasswordFormData(validatedData as PasswordFormData);
      return;
    }

    setPasswordFormData(validatedData as PasswordFormData);
    if (!isValid) return;

    dispatch(
      changePassword({
        currentPassword: validatedData.currentPassword.value,
        newPassword: validatedData.newPassword.value,
      }),
    );
    setPasswordFormData(PASSWORD_FORM_INITIAL_STATE);
  };

  const handlePasswordFormChange = (property: keyof PasswordFormData, value: string) => {
    setPasswordFormData((prev) => ({
      ...prev,
      [property]: {
        ...prev[property],
        value,
        error: null,
      },
    }));
  };

  const formattedRole = user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase() : "";

  return (
    <Box className={styles.profileContainer}>
      {alert?.message && (
        <Alert severity={alert.severity ?? "info"} onClose={() => dispatch(alertActions.clearAlert())} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ maxWidth: 1400, ml: "2px", mr: "auto" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ProfileInformation
            email={user?.email || ""}
            role={formattedRole}
            name={name}
            onNameChange={setName}
            onSubmit={handleUpdateProfile}
            isLoading={isLoading}
            error={null}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <PasswordChange
            formData={passwordFormData}
            onFormChange={handlePasswordFormChange}
            onSubmit={handleChangePassword}
            isLoading={isLoading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile;
