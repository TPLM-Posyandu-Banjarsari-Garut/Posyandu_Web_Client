export interface Examination {
    id: string;
    posyandu_id: string;
    name: string;
    description: string | null;
    examination_type: 'infant' | 'pregnant_mother' | 'toddler' | 'young_child';
    target_age_months: number | null;
    target_trimester: string | null;
    checklist_items: any | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface ExaminationsListResponse {
    data: Examination[];
    meta: {
        page: number;
        limit: number;
        totalItems: number;
    }
}

export interface CreateExaminationPayload {
    posyandu_id: string;
    name: string;
    description?: string | null;
    examination_type: 'infant' | 'pregnant_mother' | 'toddler' | 'young_child';
    target_age_months?: number | null;
    target_trimester?: string | null;
    is_active?: boolean;
}

export interface UpdateExaminationPayload extends Partial<CreateExaminationPayload> {}

