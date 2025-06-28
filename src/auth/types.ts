export type UserType = Record<string, any> | null;

export type AuthState = {
  user: UserType;
  loading: boolean;
  isAdmin?: boolean;
};

export type AuthContextValue = {
  user: UserType;
  isAdmin?: boolean;
  loading: boolean;
  authenticated: boolean;
  unauthenticated: boolean;
  checkUserSession?: () => Promise<void>;
};
