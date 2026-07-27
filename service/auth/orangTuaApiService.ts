import { api } from "./authService";
import { SessionUser } from "./authService";

export const orangTuaApi = api;

export async function fetchOrangTuaCurrentUser(): Promise<SessionUser> {
  const { data } = await orangTuaApi.get<{ data: { user: SessionUser } }>("/api/auth/me");
  return data.data.user;
}
