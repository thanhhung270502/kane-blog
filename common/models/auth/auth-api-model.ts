import { APIBaseRoutes } from "../../constants";
import type { APIDefinition } from "../api-route-model";
import { APIMethod } from "../api-route-model";

import type {
  GetUserByIdResponse,
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  RefreshResponse,
  SignUpRequest,
  SignUpResponse,
  UserObject,
} from "./auth-model";

export const API_SIGNUP: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/signup",
  requestBody: {} as SignUpRequest,
  responseBody: {} as SignUpResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/signup`,
};

export const API_LOGIN: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/login",
  requestBody: {} as LoginRequest,
  responseBody: {} as LoginResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/login`,
};

export const API_ME: APIDefinition = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/me",
  responseBody: {} as UserObject,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/me`,
};

export const API_GET_USER_BY_ID: APIDefinition<{ userId: string }> = {
  method: APIMethod.GET,
  baseUrl: APIBaseRoutes.USERS,
  subUrl: "/:userId",
  responseBody: {} as GetUserByIdResponse,
  buildUrlPath: ({ userId }) => `${APIBaseRoutes.USERS}/${userId}`,
};

export const API_LOGOUT: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/logout",
  responseBody: {} as LogoutResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/logout`,
};

export const API_REFRESH: APIDefinition = {
  method: APIMethod.POST,
  baseUrl: APIBaseRoutes.AUTH,
  subUrl: "/refresh",
  responseBody: {} as RefreshResponse,
  buildUrlPath: () => `${APIBaseRoutes.AUTH}/refresh`,
};
