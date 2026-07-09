import axios from "axios";
import { SessionUser } from "./authService";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://api.posyandubanjarsari.my.id");

export const orangTuaApi = axios.create({
  baseURL: API_URL, // ALWAYS bypass proxy to ensure Google Login cookies on the backend domain are read
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function fetchOrangTuaCurrentUser(): Promise<SessionUser> {
  const { data } = await orangTuaApi.get<{ data: { user: SessionUser } }>("/api/auth/me");
  return data.data.user;
}
