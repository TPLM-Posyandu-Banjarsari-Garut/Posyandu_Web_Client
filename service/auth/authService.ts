import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isBrowser = typeof window !== "undefined";

/**
 * Shared Axios instance for all authenticated requests.
 * withCredentials: true ensures the HttpOnly session cookie
 * (better-auth.session_token) is sent automatically.
 */
export const api = axios.create({
  baseURL: isBrowser ? "" : API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  image?: string | null;
}

interface AuthMeResponse {
  status: string;
  message: string;
  data: {
    session: unknown;
    user: SessionUser;
  };
}

/**
 * Fetches the currently authenticated user from the server
 * by reading the HttpOnly session cookie.
 * Use the `useCurrentUser` React Query hook instead of calling this directly.
 */
export async function fetchCurrentUser(): Promise<SessionUser> {
  const { data } = await api.get<AuthMeResponse>("/api/auth/me");
  return data.data.user;
}
