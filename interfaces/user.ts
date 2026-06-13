export type BackendRole = "posyandu_admin" | "village_admin" | "parent" | "cadre" | "midwife";

export interface BackendUser {
  id: string;
  email: string;
  name: string;
  phone_number?: string | null;
  role: BackendRole;
  status: "active" | "suspended";
  avatar_url?: string | null;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface GetUsersData {
  data: BackendUser[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface CreateUserPayload {
  email: string;
  name: string;
  password?: string;
  phone_number?: string | null;
  role: BackendRole;
  status?: "active" | "suspended";
}
