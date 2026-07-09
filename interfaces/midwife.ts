export interface Midwife {
  id: string;
  user_id: string;
  posyandu_id: string;
  identity_number: string | null;
  license_number: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
  name?: string;
  email?: string;
}
