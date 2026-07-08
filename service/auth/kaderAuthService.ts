import { api, API_URL } from "@/service/auth/authService";
import { KaderLoginPayload, KaderLoginResponse, ResetPasswordOTPPayload } from "@/interfaces/auth";

export { api as kaderApi };

export async function loginKader(
  payload: KaderLoginPayload
): Promise<KaderLoginResponse> {
  const { data } = await api.post<KaderLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

import axios from "axios";

export async function logoutKader(): Promise<void> {
  const backendUrl =
    API_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://api.posyandubanjarsari.my.id");

  await axios.post(
    `${backendUrl}/api/auth/sign-out`,
    {},
    { withCredentials: true }
  );
}

export async function requestPasswordResetOTP(email: string): Promise<any> {
  const { data } = await api.post<any>("/api/auth/email-otp/send-verification-otp", {
    email,
    type: "forget-password",
  });
  return data;
}

export async function resetPasswordWithOTP(payload: ResetPasswordOTPPayload): Promise<any> {
  const { data } = await api.post<any>("/api/auth/email-otp/reset-password", payload);
  return data;
}

