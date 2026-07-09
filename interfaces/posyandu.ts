export interface Posyandu {
  id: string;
  name: string;
  health_center_id?: string | null;
  address_line?: string | null;
  rt?: string | null;
  rw?: string | null;
  village_name?: string | null;
  contact_number?: string | null;
  status: "active" | "inactive";
  created_at?: string;
  updated_at?: string;
}

export interface CreatePosyanduPayload {
  name: string;
  health_center_id?: string | null;
  address_line?: string | null;
  rt?: string | null;
  rw?: string | null;
  village_name?: string | null;
  contact_number?: string | null;
  status?: "active" | "inactive";
}

export interface UpdatePosyanduPayload extends Partial<CreatePosyanduPayload> {}
