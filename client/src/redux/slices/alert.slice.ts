import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AlertDto } from "../../utilities/models";

const alertSlice = createSlice({
  name: "alert",
  initialState: null as AlertDto | null,
  reducers: {
    setAlert: (_, action: PayloadAction<AlertDto>) => action.payload,
    clearAlert: () => null,
  },
});

export const alertActions = alertSlice.actions;
export default alertSlice.reducer;
