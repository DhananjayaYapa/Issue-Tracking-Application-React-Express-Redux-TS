// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const exceptionHandler = async (error: any): Promise<string> => {
  return new Promise((resolve) => {
    let errorMsg = "Oops! Something went wrong.";

    if (error) {
      switch (error.status) {
        case 0:
          errorMsg = error.data?.message || "Network Failure Detected";
          break;
        case 400:
          errorMsg = error.data?.message || "Bad Request";
          break;
        case 401:
          errorMsg = error.data?.message || "Unauthorized - Please login again";
          localStorage.removeItem("token");
          break;
        case 403:
          errorMsg = error.data?.message || "Forbidden - Access denied";
          break;
        case 404:
          errorMsg = error.data?.message || "Resource Not Found";
          break;
        case 409:
          errorMsg = error.data?.message || "Conflict";
          break;
        case 422:
          errorMsg = error.data?.message || "Validation Error";
          break;
        case 500:
          errorMsg = error.data?.message || "Internal Server Error";
          break;
        case 504:
          errorMsg = error.data?.message || "Network Failure Detected";
          break;
        default:
          errorMsg = error.data?.message || "Oops! Something went wrong";
      }
    }

    resolve(errorMsg);
  });
};
