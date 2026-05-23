export interface AlertActionDto {
  type: string;
  message: string;
  severity: "error" | "warning" | "info" | "success";
  autoClear?: boolean;
  timeout?: number;
}

export interface AlertDto {
  message: string;
  severity: "error" | "warning" | "info" | "success";
}
