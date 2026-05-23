import { configureStore } from "@reduxjs/toolkit";
import { alertReducer, authReducer, issueReducer, userReducer } from "../slices";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    issues: issueReducer,
    users: userReducer,
    alert: alertReducer,
  },
  devTools: import.meta.env.VITE_APP_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
