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

export interface NewbornReportItem {
  id: string;
  name: string;
  identity_number: string;
  gender: "male" | "female";
  child_category: string | null;
  place_of_birth: string | null;
  birth_date: string | null;
  birth_order: number | null;
  blood_type: string | null;
  birth_weight: string | null;
  birth_length: string | null;
  birth_head_circumference: string | null;
  created_at: string | null;
  posyandu_id: string;
  posyandu_name: string | null;
  posyandu_village: string | null;
  posyandu_rt: string | null;
  posyandu_rw: string | null;
  mother_name: string | null;
  mother_nik: string | null;
  mother_phone: string | null;
  mother_address: string | null;
  mother_rt: string | null;
  mother_rw: string | null;
}

export interface NewbornReportSummary {
  total_newborns: number;
  male_count: number;
  female_count: number;
  total_posyandus: number;
}

export interface NewbornReportData {
  summary: NewbornReportSummary;
  data: NewbornReportItem[];
  meta: {
    page: number;
    limit: number;
    total_items: number;
    total_pages: number;
  };
}

export interface NewbornReportResponse {
  success: boolean;
  message: string;
  data: NewbornReportData;
}

export interface NewbornReportParams {
  month: number;
  year: number;
  posyandu_id?: string;
  search?: string;
  page?: number;
  limit?: number;
}
