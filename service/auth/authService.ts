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
    let isCsrfError = false;

    if (error.response?.status === 403 && error.response?.data) {
      const rawMessage = extractErrorMessage(error.response.data, "");
      isCsrfError = rawMessage.toLowerCase().includes("csrf");
    }

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

export interface VerifyEmailOTPPayload {
  email: string;
  otp: string;
}

export interface ResendEmailOTPPayload {
  email: string;
  type?: "email-verification" | "forget-password";
}

export async function verifyEmailOTP(payload: VerifyEmailOTPPayload): Promise<{ success: boolean; message?: string }> {
  const { data } = await api.post<{ success: boolean; message?: string }>(
    "/api/auth/email-otp/verify-email",
    payload
  );
  return data;
}

export async function resendEmailOTP(payload: ResendEmailOTPPayload): Promise<{ success: boolean; message?: string }> {
  const { data } = await api.post<{ success: boolean; message?: string }>(
    "/api/auth/email-otp/send-verification-otp",
    {
      email: payload.email,
      type: payload.type ?? "email-verification",
    }
  );
  return data;
}

/**
 * Ekstraksi pesan error yang aman dari berbagai bentuk response error backend
 * (string, object, array, better-auth error object, Cloudflare turnstile)
 */
export function extractErrorMessage(data: unknown, fallback = "Terjadi kesalahan"): string {
  if (!data) return fallback;

  if (typeof data === "string") {
    if (data.trim().startsWith("<")) return fallback;
    return data;
  }

  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;

    // 1. Pesan langsung dalam string message
    if (typeof obj.message === "string" && obj.message.trim()) {
      return obj.message;
    }

    // 2. Pesan berbentuk array
    if (Array.isArray(obj.message) && obj.message.length > 0) {
      const first = obj.message[0];
      if (typeof first === "string" && first.trim()) return first;
      if (first && typeof first === "object" && "message" in first && typeof (first as any).message === "string") {
        return (first as any).message;
      }
    }

    // 3. Error langsung berupa string
    if (typeof obj.error === "string" && obj.error.trim()) {
      return obj.error;
    }

    // 4. Error berbentuk object (seperti Better-Auth: { error: { message: "...", status: 400 } })
    if (obj.error && typeof obj.error === "object") {
      const errObj = obj.error as Record<string, unknown>;
      if (typeof errObj.message === "string" && errObj.message.trim()) {
        return errObj.message;
      }
      if (typeof errObj.error === "string" && errObj.error.trim()) {
        return errObj.error;
      }
      if (typeof errObj.statusText === "string" && errObj.statusText.trim()) {
        return errObj.statusText;
      }
    }

    // 5. Error berbentuk array
    if (Array.isArray(obj.error) && obj.error.length > 0) {
      const first = obj.error[0];
      if (typeof first === "string" && first.trim()) return first;
    }

    // 6. Error code langsung dari Cloudflare Turnstile
    if (Array.isArray(obj["error-codes"]) && (obj["error-codes"] as unknown[]).length > 0) {
      const first = (obj["error-codes"] as unknown[])[0];
      if (typeof first === "string" && first.trim()) return `Turnstile error: ${first}`;
    }

    // 7. Format array errors umum
    if (Array.isArray(obj.errors) && obj.errors.length > 0) {
      const first = obj.errors[0];
      if (typeof first === "string" && first.trim()) return first;
      if (first && typeof first === "object" && "message" in first && typeof (first as any).message === "string") {
        return (first as any).message;
      }
    }
  }

  return fallback;
}

/**
 * Helper terpusat untuk mengambil pesan error dari Axios error atau general Error
 */
export function getApiErrorMessage(
  error: unknown,
  fallback = "Terjadi kesalahan saat memproses permintaan"
): string {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return "Tidak dapat terhubung ke server. Pastikan koneksi internet aktif dan coba lagi.";
    }
    return extractErrorMessage(error.response.data, fallback);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return fallback;
}

export function isEmailNotVerifiedError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data;
  if (!data) return false;

  let code = "";
  if (typeof data === "object" && data !== null) {
    const obj = data as Record<string, unknown>;
    if (typeof obj.code === "string") {
      code = obj.code.toUpperCase();
    } else if (typeof obj.code === "number") {
      code = String(obj.code);
    } else if (obj.error && typeof obj.error === "object") {
      const errObj = obj.error as Record<string, unknown>;
      if (typeof errObj.code === "string") {
        code = errObj.code.toUpperCase();
      }
    }
  }

  const rawMessage = extractErrorMessage(data, "");
  const message = rawMessage.toLowerCase();

  return (
    code === "EMAIL_NOT_VERIFIED" ||
    message.includes("email not verified") ||
    message.includes("belum diverifikasi")
  );
}
