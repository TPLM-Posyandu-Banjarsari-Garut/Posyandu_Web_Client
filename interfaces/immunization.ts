export interface ImmunizationRecord {
  id: string;
  children_id: string;
  vaccine_id: string;
  cadre_id?: string | null;
  midwife_id?: string | null;
  posyandu_id?: string | null;
  inventory_id?: string | null;
  dose_number: number;
  date_given?: string | null;
  batch_number?: string | null;
  status: 'not_yet' | 'scheduled' | 'completed' | 'missed';
  kipi_status: boolean;
  schedule_compliance?: 'on_time' | 'late' | 'non_compliant' | null;
  status_dofu: boolean;
  sync_status: 'pending' | 'synced' | 'failed';
  external_ref_id?: string | null;
  location_type?: 'posyandu' | 'puskesmas' | 'pustu' | 'home' | 'school' | 'paud' | 'kindergarten' | 'daycare' | null;
  notes?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateImmunizationRecordPayload {
  children_id: string;
  vaccine_id: string;
  dose_number: number;
  date_given?: string | null;
  status?: 'not_yet' | 'scheduled' | 'completed' | 'missed';
  notes?: string | null;
  midwife_id?: string | null;
  cadre_id?: string | null;
  posyandu_id?: string | null;
}
