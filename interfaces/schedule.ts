export interface ExaminationSchedule {
    id: string;
    examination_id: string;
    posyandu_id: string;
    midwife_id: string | null;
    cadre_id: string | null;
    scheduled_date: string; // ISO date string
    start_time: string | null; // HH:mm
    end_time: string | null; // HH:mm
    max_participants: number | null;
    current_participants: number;
    location_notes: string | null;
    status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface SchedulesListResponse {
    data: ExaminationSchedule[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
    };
}

export interface CreateSchedulePayload {
    examination_id: string;
    posyandu_id: string;
    scheduled_date: string; // YYYY-MM-DD
    start_time?: string | null;
    end_time?: string | null;
    max_participants?: number;
    location_notes?: string | null;
    notes?: string | null;
}

export interface UpdateSchedulePayload extends Partial<CreateSchedulePayload> {
    status?: 'pending' | 'in_progress' | 'completed' | 'cancelled';
}
