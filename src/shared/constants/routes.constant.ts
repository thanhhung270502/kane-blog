import { RouteKey } from "../enums";

export const ClientAPIRoutes = {
  AUTH: {
    login: () => "/api/auth/login",
    signup: () => "/api/auth/signup",
    logout: () => "/api/auth/logout",
    refresh: () => "/api/auth/refresh",
    me: () => "/api/auth/me",
  },
};

export const ClientRoutes: Record<RouteKey, string> = {
  [RouteKey.HOME]: "/home",
  [RouteKey.LOGIN]: "/login",
  [RouteKey.SIGNUP]: "/signup",
  [RouteKey.USER_DETAIL]: "/users/:userId",
};
