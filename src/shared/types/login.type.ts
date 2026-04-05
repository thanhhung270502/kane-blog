export type TLoginSession = {
  email: string;
  sessionToken: string;
  expiresAt: Date;
  hasProfile: boolean;
};
