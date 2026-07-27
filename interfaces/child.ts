export interface Child {
  id: string;
  posyandu_id: string;
  name: string;
  identity_number: string;
  gender: "male" | "female";
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
  mother_name?: string | null;
  parent_user_id?: string | null;
  posyandu_detail?: {
    name?: string;
    village_name?: string;
    address_line?: string;
    rt?: string;
    rw?: string;
  } | null;
  latest_nutrition?: {
    measurement_date?: string;
    weight_kg?: string;
    height_cm?: string;
    head_circumference_cm?: string;
    nutrition_status?: string;
    age_months?: number;
  } | null;
  latest_vitamin?: {
    date_given?: string;
    distribution_period?: string;
    distribution_year?: number;
  } | null;
}

export interface CreateChildPayload {
  posyandu_id: string;
  name: string;
  identity_number: string;
  gender: "male" | "female";
  child_category?: string | null;
  place_of_birth?: string | null;
  birth_date?: string | null;
  birth_order?: number | null;
  blood_type?: "A" | "B" | "AB" | "O" | null;
  birth_weight?: string | null;
  birth_length?: string | null;
  birth_head_circumference?: string | null;
  parent_user_id?: string | null;
  mother_name?: string | null;
}
