import { API_ROUTES } from "../utilities/constants";
import type { User, ApiResponseDto, UserParams } from "../utilities/models";
import { axiosPrivateInstance } from "./axios";

const getUsers = () => {
  return axiosPrivateInstance.get<ApiResponseDto<User[]>>(API_ROUTES.USERS);
};

const getUser = (params: UserParams) => {
  return axiosPrivateInstance.get<ApiResponseDto<User>>(
    API_ROUTES.USER_BY_ID(params.id),
  );
};

const deleteUser = (params: UserParams) => {
  return axiosPrivateInstance.delete(API_ROUTES.USER_BY_ID(params.id));
};

const enableUser = (params: UserParams) => {
  return axiosPrivateInstance.patch(API_ROUTES.USER_ENABLE(params.id));
};

const disableUser = (params: UserParams) => {
  return axiosPrivateInstance.patch(API_ROUTES.USER_DISABLE(params.id));
};

const permanentDeleteUser = (params: UserParams) => {
  return axiosPrivateInstance.delete(
    API_ROUTES.USER_PERMANENT_DELETE(params.id),
  );
};

export const userService = {
  getUsers,
  getUser,
  deleteUser,
  enableUser,
  disableUser,
  permanentDeleteUser,
};
