import type { UserProfileObject } from "../social/social-model";

/**
 * Signup
 */
export interface SignUpRequest {
  email: string;
  password: string;
  name?: string;
}

export enum EUserRole {
  USER = "user",
  ADMIN = "admin",
}

export interface UserRow {
  id: string;
  email: string;
  password_hash: string | null;
  name: string;
  role: string;
  phone: string | null;
  google_sub: string | null;
  avatar_path: string | null;
}

export interface UserObject {
  id: string;
  email: string;
  name: string;
  role: EUserRole;
  phone?: string;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  createdAt?: string;
}

/** Public user fields (no email); avatar from `users.avatar_path` via S3. */
export interface PublicUserObject {
  id: string;
  name: string;
  role: EUserRole;
  avatarUrl: string | null;
  createdAt: string;
}

/** GET /api/users/:userId */
export interface GetUserByIdResponse {
  user: PublicUserObject;
  profile: UserProfileObject | null;
}

export interface CurrentUserObject {
  id: string;
  email: string;
  name: string;
  role: EUserRole;
  bio?: string;
  avatarUrl?: string;
  coverUrl?: string;
  createdAt?: string;
}
export interface CurrentUserResponse {
  isLoading: boolean;
  user: CurrentUserObject | undefined;
}

export interface SessionObject {
  token: string;
  expiresAt: Date;
  expiresInSeconds: number;
}

export interface SignUpResponse {
  user: UserObject;
  session: SessionObject;
}

/**
 * Login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  expiresIn: number;
}

/**
 * Logout
 */
export interface LogoutResponse {
  message: string;
}

/**
 * Refresh
 */
export interface RefreshResponse {
  expiresIn: number;
}

/**
 * User Address
 */
export interface UserAddressRow {
  id: string;
  user_id: string;
  company_name: string | null;
  address: string | null;
  unit_or_suite: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
  is_primary: boolean;
}
