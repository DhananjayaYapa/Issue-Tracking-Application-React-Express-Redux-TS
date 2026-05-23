import type { AxiosError } from "axios";
import { userService } from "../../services";
import { userActions } from "../slices";
import type { User, UserParams } from "../../utilities/models";
import type { AppDispatch } from "../store";
import { dispatchAlert } from "../../utilities/helpers";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }

  const axiosError = error as AxiosError<{ message?: string; error?: string }>;
  return (
    axiosError.response?.data?.message ||
    axiosError.response?.data?.error ||
    axiosError.message ||
    "Oops! Something went wrong."
  );
};

const normalizeUsersPayload = (payload: unknown): User[] => {
  if (Array.isArray(payload)) {
    return payload as User[];
  }

  const candidates = payload as { items?: unknown; users?: unknown };

  if (Array.isArray(candidates?.items)) {
    return candidates.items as User[];
  }

  if (Array.isArray(candidates?.users)) {
    return candidates.users as User[];
  }

  return [];
};

export const fetchUsers = () => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(userActions.fetchUsersRequest());

    try {
      const response = await userService.getUsers();
      dispatch(userActions.fetchUsersSuccess(normalizeUsersPayload(response.data.data)));
    } catch (error) {
      dispatch(userActions.fetchUsersError(getErrorMessage(error)));
    }
  };
};

export const fetchUser = (params: UserParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(userActions.fetchUserRequest());

    try {
      const response = await userService.getUser(params);
      dispatch(userActions.fetchUserSuccess(response.data.data));
    } catch (error) {
      dispatch(userActions.fetchUserError(getErrorMessage(error)));
    }
  };
};

export const deleteUser = (params: UserParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(userActions.userActionRequest());

    try {
      await userService.deleteUser(params);
      dispatch(userActions.userActionSuccess());
      dispatchAlert(dispatch, {
        message: "User disabled successfully",
        severity: "success",
      });
      dispatch(fetchUsers());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userActions.userActionError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const enableUser = (params: UserParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(userActions.userActionRequest());

    try {
      await userService.enableUser(params);
      dispatch(userActions.userActionSuccess());
      dispatchAlert(dispatch, {
        message: "User enabled successfully",
        severity: "success",
      });
      dispatch(fetchUsers());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userActions.userActionError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const disableUser = (params: UserParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(userActions.userActionRequest());

    try {
      await userService.disableUser(params);
      dispatch(userActions.userActionSuccess());
      dispatchAlert(dispatch, {
        message: "User disabled successfully",
        severity: "success",
      });
      dispatch(fetchUsers());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userActions.userActionError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};

export const permanentDeleteUser = (params: UserParams) => {
  return async (dispatch: AppDispatch): Promise<void> => {
    dispatch(userActions.userActionRequest());

    try {
      await userService.permanentDeleteUser(params);
      dispatch(userActions.userActionSuccess());
      dispatchAlert(dispatch, {
        message: "User permanently deleted successfully",
        severity: "success",
      });
      dispatch(fetchUsers());
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      dispatch(userActions.userActionError(errorMessage));
      dispatchAlert(dispatch, {
        message: errorMessage,
        severity: "error",
      });
    }
  };
};
