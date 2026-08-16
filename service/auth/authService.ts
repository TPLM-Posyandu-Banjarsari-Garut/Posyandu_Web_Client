import axios from "axios";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;
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

// ─── CSRF Token Auto-Manager ──────────────────────────────────────────────────
let cachedCsrfToken: string | null = null;
let csrfFetchPromise: Promise<string | null> | null = null;

/**
 * Mengambil CSRF token dari server dan menyimpannya di memory.
 * Menggunakan direct axios call agar tidak memicu interceptor loop.
 */
export async function fetchCsrfToken(): Promise<string | null> {
  if (cachedCsrfToken) return cachedCsrfToken;
  if (csrfFetchPromise) return csrfFetchPromise;

  csrfFetchPromise = (async () => {
    try {
      const baseURL = isBrowser ? "" : (API_URL || "");
      const res = await axios.get<{ csrfToken: string }>(`${baseURL}/api/csrf-token`, {
        withCredentials: true,
      });
      cachedCsrfToken = res.data?.csrfToken ?? null;
      return cachedCsrfToken;
    } catch {
      return null;
    } finally {
      csrfFetchPromise = null;
    }
  })();

  return csrfFetchPromise;
}

export function clearCsrfToken(): void {
  cachedCsrfToken = null;
}

// Request Interceptor: Otomatis lampirkan header X-CSRF-Token pada POST/PUT/PATCH/DELETE
api.interceptors.request.use(
  async (config) => {
    const method = config.method?.toUpperCase();
    const isMutating =
      method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE";

    // Jangan pasang pada endpoint fetching csrf-token itu sendiri
    if (isMutating && !config.url?.includes("/api/csrf-token")) {
      const token = await fetchCsrfToken();
      if (token) {
        config.headers["X-CSRF-Token"] = token;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Otomatis refresh CSRF token & retry request jika terjadi 403 CSRF error
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isCsrfError =
      error.response?.status === 403 &&
      (error.response?.data?.message?.toLowerCase().includes("csrf") ||
        error.response?.data?.error?.toLowerCase().includes("csrf"));

    if (isCsrfError && originalRequest && !originalRequest._retryCsrf) {
      originalRequest._retryCsrf = true;
      clearCsrfToken(); // Invalidate cached token
      const newToken = await fetchCsrfToken();
      if (newToken) {
        originalRequest.headers["X-CSRF-Token"] = newToken;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

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

export interface UpdateUserPayload {
  image?: string;
  name?: string;
}

export async function updateUserProfile(payload: UpdateUserPayload): Promise<void> {
  await api.post("/api/auth/update-user", payload);
}

export interface ChangePasswordPayload {
  newPassword: string;
  currentPassword?: string;
  revokeOtherSessions?: boolean;
}

export async function changePassword(payload: ChangePasswordPayload): Promise<void> {
  await api.post("/api/auth/change-password", payload);
}
