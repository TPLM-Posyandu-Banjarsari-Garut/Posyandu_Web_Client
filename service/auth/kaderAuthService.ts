import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isBrowser = typeof window !== "undefined";

import { KaderLoginPayload, KaderLoginResponse, KaderUser } from "@/interfaces/auth";

export const kaderApi = axios.create({
  baseURL: isBrowser ? "" : API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

kaderApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getKaderToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function loginKader(
  payload: KaderLoginPayload
): Promise<KaderLoginResponse> {
  const { data } = await kaderApi.post<KaderLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export function saveKaderSession(
  token: string,
  user: KaderUser,
  remember: boolean
) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("kader_token", token);
  storage.setItem("kader_user", JSON.stringify(user));
}

export function clearKaderSession() {
  localStorage.removeItem("kader_token");
  localStorage.removeItem("kader_user");
  sessionStorage.removeItem("kader_token");
  sessionStorage.removeItem("kader_user");
}

export function getKaderToken(): string | null {
  return (
    localStorage.getItem("kader_token") ?? sessionStorage.getItem("kader_token")
  );
}

export async function logoutKader(): Promise<void> {
  await kaderApi.post("/api/auth/sign-out");
  clearKaderSession();
}
