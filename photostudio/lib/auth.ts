export type AuthUser = {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  profileImage?: string;
  roles?: string[];
};

const ACCESS_TOKEN_KEY = "accessToken";
const REFRESH_TOKEN_KEY = "refreshToken";
const AUTH_USER_KEY = "authUser";

const isBrowser = () => typeof window !== "undefined";

export function saveAuthSession(accessToken: string, refreshToken: string, user: AuthUser): void {
  if (!isBrowser()) return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearAuthSession(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getAccessToken(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (!isBrowser()) return null;
  const raw = localStorage.getItem(AUTH_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return Boolean(getAccessToken());
}

export function isAdmin(): boolean {
  const user = getAuthUser();
  const roles = user?.roles ?? [];
  // Backend uses Spring-style names (ROLE_ADMIN); accept legacy "admin" too.
  return roles.some((r) => r === "ROLE_ADMIN" || r === "admin");
}
