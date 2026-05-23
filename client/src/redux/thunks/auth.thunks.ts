import type { AxiosError } from "axios";
import type {
  LoginPayload,
  RegisterPayload,
} from "../../utilities/models";
import { authService } from "../../services";
import { authActions } from "../slices";
import type { AppDispatch } from "../store";
import { dispatchAlert } from "../../utilities/helpers";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  const axiosError = error as AxiosError<{ message?: string }>;
  return (
    axiosError.response?.data?.message ||
    axiosError.message ||
    "Oops! Something went wrong."
  );
};

export const loginUser = (payload: LoginPayload) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(authActions.loginRequest());

    try {
      const response =
        await authService.login(payload);
      const authData = response.data.data;

      await authService.setToken(authData.token);
      dispatch(authActions.loginSuccess(authData));
    } catch (error) {
      dispatch(authActions.loginError(getErrorMessage(error)));
    }
  };
};

export const registerUser = (payload: RegisterPayload) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(authActions.registerRequest());

    try {
      const response =
        await authService.register(payload);

      dispatch(authActions.registerSuccess());
      dispatchAlert(dispatch, {
        message: response.data.message || "Registration successful. Please login.",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(authActions.registerError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const fetchProfile = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    if (!authService.isAuthenticated()) {
      dispatch(authActions.clearAuth());
      return;
    }

    dispatch(authActions.fetchProfileRequest());

    try {
      const response = await authService.getProfile();
      dispatch(authActions.fetchProfileSuccess(response.data.data));
    } catch (error) {
      dispatch(authActions.fetchProfileError(getErrorMessage(error)));
    }
  };
};

export const updateProfile = (data: { name: string }) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(authActions.updateProfileRequest());

    try {
      const response = await authService.updateProfile(data);
      dispatch(authActions.updateProfileSuccess(response.data.data));
      dispatchAlert(dispatch, {
        message: response.data.message || "Profile updated successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(authActions.updateProfileError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const changePassword = (data: {
  currentPassword: string;
  newPassword: string;
}) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(authActions.changePasswordRequest());

    try {
      const response =
        await authService.changePassword(data);
      dispatch(authActions.changePasswordSuccess());
      dispatchAlert(dispatch, {
        message: response.data?.message || "Password changed successfully",
        severity: "success",
      });
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(authActions.changePasswordError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const logoutUser = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    try {
      await authService.logout();
    } finally {
      dispatch(authActions.clearAuth());
    }
  };
};
