import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  SignUpRequest,
  SignUpResponse,
  UserObject,
} from "@common";
import { API_LOGIN, API_LOGOUT, API_ME, API_REFRESH, API_SIGNUP } from "@common";

import { getRequest, postRequest } from "@/libs/api-client";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await postRequest({
    path: API_LOGIN.buildUrlPath({}),
    data,
  });
  return response.data;
};

export const register = async (data: SignUpRequest): Promise<SignUpResponse> => {
  const response = await postRequest({
    path: API_SIGNUP.buildUrlPath({}),
    data,
  });
  return response.data;
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await postRequest({
    path: API_LOGOUT.buildUrlPath({}),
  });
  return response.data;
};

export const getMe = async (): Promise<UserObject> => {
  return await getRequest({
    path: API_ME.buildUrlPath({}),
  });
};

export const refresh = async (): Promise<RefreshResponse> => {
  const response = await postRequest({
    path: API_REFRESH.buildUrlPath({}),
  });
  return response.data;
};
