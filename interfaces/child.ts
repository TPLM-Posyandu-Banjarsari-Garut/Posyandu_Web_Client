export interface Child {
  id: string;
  posyandu_id: string;
  name: string;
  identity_number: string;
  gender: "L" | "P";
  child_category?: string | null;
  place_of_birth?: string | null;
  birth_date?: string | null;
  birth_order?: number | null;
  blood_type?: "A" | "B" | "AB" | "O" | null;
  birth_weight?: string | null;
  birth_length?: string | null;
  birth_head_circumference?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateChildPayload {
  posyandu_id: string;
  name: string;
  identity_number: string;
  gender: "L" | "P";
  child_category?: string | null;
  place_of_birth?: string | null;
  birth_date?: string | null;
  birth_order?: number | null;
  blood_type?: "A" | "B" | "AB" | "O" | null;
  birth_weight?: string | null;
  birth_length?: string | null;
  birth_head_circumference?: string | null;
}
