export type ConsultationType = "pregnancy" | "child_development" | "general";
export type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed"
  | "no_show"
  | "in_progress";

export interface Consultation {
  id: string;
  parent_id: string;
  pregnancy_record_id?: string | null;
  children_id?: string | null;
  midwife_id?: string | null;
  cadre_id?: string | null;
  posyandu_id: string;
  consultation_type: ConsultationType;
  scheduled_at: string;
  actual_start_at?: string | null;
  duration_minutes?: number | null;
  follow_up_required: boolean;
  follow_up_date?: string | null;
  status: ConsultationStatus;
  notes?: string | null;
  cancellation_reason?: string | null;
  queue_number?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateBookingPayload {
  posyandu_id: string;
  consultation_type: ConsultationType;
  scheduled_at: string | string[];
  pregnancy_record_id?: string | null;
  children_id?: string | null;
  notes?: string | null;
  midwife_id?: string | null;
}

export interface AvailableSlot {
  time: string;
  available: boolean;
}
