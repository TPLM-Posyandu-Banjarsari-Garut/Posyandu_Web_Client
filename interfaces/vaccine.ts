export interface Vaccine {
  id: string;
  code: string;
  name: string;
  description?: string | null;
  target_age_months?: number | null;
  max_doses?: number | null;
  min_interval_days?: number | null;
  route?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateVaccinePayload {
  code: string;
  name: string;
  description?: string | null;
  target_age_months?: number | null;
  max_doses?: number | null;
  min_interval_days?: number | null;
  route?: string | null;
}
