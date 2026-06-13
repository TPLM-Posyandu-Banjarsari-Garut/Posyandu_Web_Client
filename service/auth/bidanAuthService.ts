import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isBrowser = typeof window !== "undefined";

import { BidanLoginPayload, BidanLoginResponse, BidanUser } from "@/interfaces/auth";

export const bidanApi = axios.create({
  baseURL: isBrowser ? "" : API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

bidanApi.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = getBidanToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export async function loginBidan(
  payload: BidanLoginPayload
): Promise<BidanLoginResponse> {
  const { data } = await bidanApi.post<BidanLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export function saveBidanSession(
  token: string,
  user: BidanUser,
  remember: boolean
) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("bidan_token", token);
  storage.setItem("bidan_user", JSON.stringify(user));
}

export function clearBidanSession() {
  localStorage.removeItem("bidan_token");
  localStorage.removeItem("bidan_user");
  sessionStorage.removeItem("bidan_token");
  sessionStorage.removeItem("bidan_user");
}

export function getBidanToken(): string | null {
  return (
    localStorage.getItem("bidan_token") ?? sessionStorage.getItem("bidan_token")
  );
}

export async function logoutBidan(): Promise<void> {
  await bidanApi.post("/api/auth/sign-out");
  clearBidanSession();
}
