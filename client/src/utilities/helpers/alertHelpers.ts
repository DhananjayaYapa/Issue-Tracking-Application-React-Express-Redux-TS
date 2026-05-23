import type { AppDispatch } from "@redux/store";
import { alertActions } from "@redux/slices";
import { ALERT_CONFIGS } from "@utilities/constants";
import type { AlertDto } from "@utilities/models";

export const dispatchAlert = (
  dispatch: AppDispatch,
  alert: AlertDto,
  timeout = ALERT_CONFIGS.TIMEOUT,
): void => {
  dispatch(alertActions.setAlert(alert));
  setTimeout(() => {
    dispatch(alertActions.clearAlert());
  }, timeout);
};
