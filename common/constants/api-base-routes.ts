export const APIBaseRoutes = {
  // ------ Public Routes ------
  AUTH: "/api/auth",

  // ------ Private Routes ------
  ORDER: "/api/orders",
  ORDER_TILE: "/api/order-tiles",
  BRAINTREE: "/api/braintree",
  TEMPLATE_COLLECTION: "/api/template-collections",
  CHAT: "/api/chat",
} as const;

export type APIBaseRoutes = (typeof APIBaseRoutes)[keyof typeof APIBaseRoutes];
