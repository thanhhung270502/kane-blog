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
  phone: string | null;
  avatarUrl: string | null;
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
