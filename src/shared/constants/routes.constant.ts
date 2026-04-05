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
  [RouteKey.LOGIN]: "/",
  [RouteKey.STUDIO]: "/studio",
  [RouteKey.STUDIO_DETAIL]: "/studio/:orderId",
  [RouteKey.ACCOUNT]: "/account",
  [RouteKey.ORDER_HISTORY]: "/account/orders",
  [RouteKey.CONTACT_INFO]: "/account/contact-info",
  [RouteKey.NEED_HELP]: "/account/need-help",
  [RouteKey.ORDER_DETAIL]: "/orders/:orderId",
  [RouteKey.ORDER_DETAIL_CHECKOUT]: "/checkout/:orderId",
  [RouteKey.GET_STARTED]: "/get-started",
  [RouteKey.PHOTO]: "/photos",
};
