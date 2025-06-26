export interface UserTokenData {
  id: number;
  email: string;
  secret: string;
}

export interface UserRefreshTokenData {
  id: number;
  secret: string;
}

export const USER_SESSION_CACHE_KEY_BASE = 'user-session:';
export const USER_REFRESH_TOKEN_CACHE_KEY_BASE = 'user-refresh-token:';
