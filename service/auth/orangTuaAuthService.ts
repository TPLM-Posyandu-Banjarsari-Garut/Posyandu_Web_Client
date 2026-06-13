import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const isBrowser = typeof window !== "undefined";

import {
  OrangTuaLoginPayload,
  OrangTuaLoginResponse,
  OrangTuaRegisterPayload,
  VerifyOTPPayload,
  ResendOTPPayload,
  OrangTuaUser,
} from "@/interfaces/auth";

export const orangTuaApi = axios.create({
  baseURL: isBrowser ? "" : API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function loginOrangTua(
  payload: OrangTuaLoginPayload
): Promise<OrangTuaLoginResponse> {
  const { data } = await orangTuaApi.post<OrangTuaLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

export async function registerOrangTua(
  payload: OrangTuaRegisterPayload
): Promise<{ user: OrangTuaUser; token?: string }> {
  const { data } = await orangTuaApi.post<{ user: OrangTuaUser; token?: string }>(
    "/api/auth/sign-up/email",
    payload
  );
  return data;
}

export async function verifyEmailOTP(payload: VerifyOTPPayload): Promise<any> {
  const { data } = await orangTuaApi.post<any>("/api/auth/email-otp/verify-email", payload);
  return data;
}

export async function resendEmailOTP(payload: ResendOTPPayload): Promise<any> {
  const { data } = await orangTuaApi.post<any>("/api/auth/email-otp/send-verification-otp", payload);
  return data;
}

export function saveOrangTuaSession(
  token: string,
  user: OrangTuaUser,
  remember: boolean
) {
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem("orangtua_token", token);
  storage.setItem("orangtua_user", JSON.stringify(user));
}

export function clearOrangTuaSession() {
  localStorage.removeItem("orangtua_token");
  localStorage.removeItem("orangtua_user");
  sessionStorage.removeItem("orangtua_token");
  sessionStorage.removeItem("orangtua_user");
}

export function getOrangTuaToken(): string | null {
  return (
    localStorage.getItem("orangtua_token") ??
    sessionStorage.getItem("orangtua_token")
  );
}

export async function logoutOrangTua(): Promise<void> {
  await orangTuaApi.post("/api/auth/sign-out");
  clearOrangTuaSession();
}
