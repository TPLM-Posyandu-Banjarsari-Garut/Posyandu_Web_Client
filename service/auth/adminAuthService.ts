import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isBrowser = typeof window !== "undefined";

import { AdminLoginPayload, AdminLoginResponse, AdminUser } from "@/interfaces/auth";

export const adminApi = axios.create({
  baseURL: isBrowser ? "" : API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

adminApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getAdminToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function loginAdmin(
  payload: AdminLoginPayload
): Promise<AdminLoginResponse> {
  const { data } = await adminApi.post<AdminLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export function saveAdminSession(
  token: string,
  user: AdminUser,
  remember: boolean
) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("admin_token", token);
  storage.setItem("admin_user", JSON.stringify(user));
}

export function clearAdminSession() {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
  sessionStorage.removeItem("admin_token");
  sessionStorage.removeItem("admin_user");
}

export function getAdminToken(): string | null {
  return (
    localStorage.getItem("admin_token") ?? sessionStorage.getItem("admin_token")
  );
}

export async function logoutAdmin(): Promise<void> {
  await adminApi.post("/api/auth/sign-out");
  clearAdminSession();
}

