export interface Cadre {
  id: string;
  user_id: string;
  posyandu_id: string;
  identity_number: string | null;
  position: "leader" | "member";
  is_primary_assignment: boolean;
  duty_area_notes: string | null;
  status: "active" | "suspended" | "inactive";
  created_at: string;
  updated_at: string;
}
