import { API_ROUTES } from '../utilities/constants'
import type {
  AuthResponseDto,
  LoginPayload,
  RegisterPayload,
  User,
  ApiResponseDto,
} from '../utilities/models'
import { axiosPublicInstance, axiosPrivateInstance } from './axios'

const login = (payload: LoginPayload) => {
  return axiosPublicInstance.post<ApiResponseDto<AuthResponseDto>>(API_ROUTES.LOGIN, payload)
}

const register = (payload: RegisterPayload) => {
  return axiosPublicInstance.post<ApiResponseDto<AuthResponseDto>>(API_ROUTES.REGISTER, payload)
}

const getProfile = () => {
  return axiosPrivateInstance.get<ApiResponseDto<User>>(API_ROUTES.PROFILE)
}

const updateProfile = (data: { name: string }) => {
  return axiosPrivateInstance.put<ApiResponseDto<User>>(API_ROUTES.PROFILE, data)
}

const changePassword = (data: { currentPassword: string; newPassword: string }) => {
  return axiosPrivateInstance.put(API_ROUTES.CHANGE_PASSWORD, data)
}

const setToken = (token: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      localStorage.setItem('token', token)
      resolve(true)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      reject(new Error('Failed to save token'))
    }
  })
}

const getToken = (): string | null => {
  return localStorage.getItem('token')
}

const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('token')
}

const logout = (): Promise<boolean> => {
  return new Promise((resolve) => {
    localStorage.removeItem('token')
    resolve(true)
  })
}

export const authService = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword,
  setToken,
  getToken,
  isAuthenticated,
  logout,
}
