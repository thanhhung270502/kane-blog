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
   * Throws an error if credentials are invalid or if the account is Google-only.
   */
  async login(email: string, plainTextPassword: string): Promise<SessionObject> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new Error("Invalid email or password");
    }

    // Google-only accounts have no password — deny password-based login
    if (!user.password_hash) {
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
   * Sign in (or register) a user via Google OAuth.
   * Strategy:
   *   1. Find by google_sub → existing Google user
   *   2. Find by email → link google_sub to existing account
   *   3. Otherwise → create a new Google-only account
   */
  async signInWithGoogle(profile: {
    sub: string;
    email: string;
    name: string;
    emailVerified: boolean;
    picture?: string;
  }): Promise<SessionObject> {
    if (!profile.emailVerified) {
      throw new Error("Google account email is not verified");
    }

    // 1. Look up by google_sub first
    let user = await UserRepository.findByGoogleSub(profile.sub);

    if (!user) {
      // 2. Look up by email — link if found
      const existingByEmail = await UserRepository.findByEmail(profile.email);

      if (existingByEmail) {
        await UserRepository.linkGoogleSub(existingByEmail.id, profile.sub);
        user = { ...existingByEmail, google_sub: profile.sub };
      } else {
        // 3. Create brand-new Google-only account
        const created = await UserRepository.createGoogleUser(
          profile.email,
          profile.name,
          profile.sub
        );
        user = { ...created, password_hash: null, google_sub: profile.sub, avatar_path: null };
      }
    }

    return this.createSession(user.id);
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
