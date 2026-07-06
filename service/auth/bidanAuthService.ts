import { api, API_URL } from "@/service/auth/authService";
import { BidanLoginPayload, BidanLoginResponse } from "@/interfaces/auth";

export { api as bidanApi };

export async function loginBidan(
  payload: BidanLoginPayload
): Promise<BidanLoginResponse> {
  const { data } = await api.post<BidanLoginResponse>(
    "/api/auth/sign-in/email",
    payload
  );
  return data;
}

import axios from "axios";

export async function logoutBidan(): Promise<void> {
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
