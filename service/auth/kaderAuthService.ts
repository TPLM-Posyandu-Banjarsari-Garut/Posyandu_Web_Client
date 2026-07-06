import { api, API_URL } from "@/service/auth/authService";
import { KaderLoginPayload, KaderLoginResponse } from "@/interfaces/auth";

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
