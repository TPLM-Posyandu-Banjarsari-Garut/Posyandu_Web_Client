export interface NutritionRecord {
  id: string;
  children_id: string;
  measurement_date: string;
  weight_kg?: string | null;
  height_cm?: string | null;
  head_circumference_cm?: string | null;
  age_months?: number | null;
  nutrition_status: 'normal' | 'underweight' | 'severely_underweight' | 'stunted' | 'wasted' | 'overweight';
  cadre_id?: string | null;
  midwife_id?: string | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateNutritionRecordPayload {
  children_id: string;
  measurement_date: string;
  weight_kg?: string | null;
  height_cm?: string | null;
  head_circumference_cm?: string | null;
  age_months?: number | null;
  nutrition_status: 'normal' | 'underweight' | 'severely_underweight' | 'stunted' | 'wasted' | 'overweight';
  midwife_id?: string | null;
  cadre_id?: string | null;
  notes?: string | null;
}
