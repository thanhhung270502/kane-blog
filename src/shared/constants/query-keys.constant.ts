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

export const SOCIAL_KEYS = {
  all: () => ["social"] as const,
  feed: (cursor?: string | null) => [...SOCIAL_KEYS.all(), "feed", cursor ?? "initial"] as const,
  post: (id: string) => [...SOCIAL_KEYS.all(), "post", id] as const,
  comments: (postId: string, cursor?: string | null) =>
    [...SOCIAL_KEYS.all(), "comments", postId, cursor ?? "initial"] as const,
  profile: (userId: string) => [...SOCIAL_KEYS.all(), "profile", userId] as const,
  myProfile: () => [...SOCIAL_KEYS.all(), "my-profile"] as const,
  friends: () => [...SOCIAL_KEYS.all(), "friends"] as const,
  pendingRequests: () => [...SOCIAL_KEYS.all(), "pending-requests"] as const,
  userPosts: (userId: string) => [...SOCIAL_KEYS.all(), "user-posts", userId] as const,
} as const;
