import type { SessionObject, SignUpResponse, UserObject } from "@common";

import { SessionRepository } from "@/repositories/session.repository";
import { UserRepository } from "@/repositories/user.repository";

import { comparePassword, hashPassword } from "./auth";

const SESSION_EXPIRY_SECONDS = Number(process.env.SESSION_EXPIRY_SECONDS ?? "86400"); // 24h default

export const AuthService = {
  /**
   * Register a new user and create an initial session.
   * Throws an error if the email is already in use.
   */
  async register(email: string, plainTextPassword: string, name?: string): Promise<SignUpResponse> {
    const existing = await UserRepository.findByEmail(email);
    if (existing) {
      throw new Error("User with this email already exists");
    }

    const hashedPassword = await hashPassword(plainTextPassword);
    const user = await UserRepository.create(email, hashedPassword, name ?? "");

    const session = await this.createSession(user.id);

    return {
      user,
      session,
    };
  },

  /**
   * Authenticate a user by email and password.
   * Throws an error if credentials are invalid.
   */
  async login(email: string, plainTextPassword: string): Promise<SessionObject> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isValid = await comparePassword(plainTextPassword, user.password_hash);
    if (!isValid) {
      throw new Error("Invalid email or password");
    }

    const session = await this.createSession(user.id);
    return session;
  },

  /**
   * Get the current user associated with a session token.
   * Returns null if the session is invalid or expired.
   */
  async getMe(token: string): Promise<UserObject | null> {
    return SessionRepository.findValidSessionWithUser(token);
  },

  /**
   * Extend a session's expiration time.
   * Returns new session details or null if the session is invalid.
   */
  async refreshSession(token: string): Promise<SessionObject | null> {
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_SECONDS * 1000);
    const updated = await SessionRepository.updateExpiration(token, expiresAt);

    if (!updated) {
      return null;
    }

    return { token, expiresAt, expiresInSeconds: SESSION_EXPIRY_SECONDS };
  },

  /**
   * Log out a user by deleting their session.
   */
  async logout(token: string): Promise<void> {
    await SessionRepository.deleteByToken(token);
  },

  /**
   * Internal helper to create a session token for a user ID.
   */
  async createSession(userId: string): Promise<SessionObject> {
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + SESSION_EXPIRY_SECONDS * 1000);

    await SessionRepository.create(userId, token, expiresAt);

    return { token, expiresAt, expiresInSeconds: SESSION_EXPIRY_SECONDS };
  },
};
