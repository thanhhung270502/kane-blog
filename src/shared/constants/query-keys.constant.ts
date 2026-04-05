export const QUERY_KEYS = {
  // USER
  USER: "user",
  // ORDER
  ORDER: "order",
  // TEMPLATE COLLECTION
  TEMPLATE_COLLECTION: "template-collections",
};

export const USER_KEYS = {
  all: () => [QUERY_KEYS.USER] as const,
  lists: () => [...USER_KEYS.all(), "lists"] as const,
  details: () => [...USER_KEYS.all(), "details"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
  me: () => [...USER_KEYS.all(), "me"] as const,
} as const;

export const ORDER_KEYS = {
  all: () => [QUERY_KEYS.ORDER] as const,
  lists: () => [...ORDER_KEYS.all(), "lists"] as const,
  detail: (id: string) => [...ORDER_KEYS.all(), id] as const,
  primary: () => [...ORDER_KEYS.all(), "primary"] as const,
} as const;

export const ORDER_TILE_KEYS = {
  all: () => ["order-tile"] as const,
  byOrder: (orderId: string) => [...ORDER_TILE_KEYS.all(), orderId] as const,
} as const;

export const BRAINTREE_KEYS = {
  token: () => ["braintree", "token"] as const,
} as const;

export const CHAT_KEYS = {
  all: () => ["chat"] as const,
  conversations: () => [...CHAT_KEYS.all(), "conversations"] as const,
  conversation: (id: string) => [...CHAT_KEYS.conversations(), id] as const,
} as const;
