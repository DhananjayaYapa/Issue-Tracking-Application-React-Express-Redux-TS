import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponseDto, AuthStateDto, User } from "../../utilities/models";

interface AuthSliceState extends AuthStateDto {
  registrationSuccess: boolean;
}

const getInitialToken = () => localStorage.getItem("token");

const initialState: AuthSliceState = {
  user: null,
  token: getInitialToken(),
  isAuthenticated: !!getInitialToken(),
  isLoading: false,
  error: null,
  registrationSuccess: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.registrationSuccess = false;
    },
    loginSuccess: (state, action: PayloadAction<AuthResponseDto>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
      state.registrationSuccess = false;
    },
    loginError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.isLoading = true;
      state.error = null;
      state.registrationSuccess = false;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.registrationSuccess = true;
    },
    registerError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = action.payload;
      state.registrationSuccess = false;
    },
    fetchProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    fetchProfileSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    fetchProfileError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.token = null;
      state.error = action.payload;
    },
    updateProfileRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    updateProfileSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.user = action.payload;
      state.error = null;
    },
    updateProfileError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    changePasswordRequest: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    changePasswordSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    changePasswordError: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearAuth: () => ({
      ...initialState,
      token: null,
      isAuthenticated: false,
    }),
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice.reducer;
