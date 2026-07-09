export type PregnancyStatus =
  | "first_trimester"
  | "second_trimester"
  | "third_trimester"
  | "postpartum"
  | "completed";

export type PregnancyRiskLevel = "low" | "medium" | "high";

export interface PregnancyRecord {
  id: string;
  parent_id: string;
  posyandu_id: string;
  midwife_id?: string | null;
  pregnancy_status: PregnancyStatus;
  risk_level: PregnancyRiskLevel;
  last_menstrual_period?: string | null;
  estimated_due_date?: string | null;
  gravida?: number | null;
  parity?: number | null;
  abortus?: number | null;
  is_active: boolean;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}
