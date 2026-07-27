import { bidanApi } from '@/service/auth/bidanAuthService';
import {
    Examination,
    ExaminationsListResponse,
    CreateExaminationPayload,
    UpdateExaminationPayload
} from '@/interfaces/examination';

interface GetExaminationsParams {
    posyandu_id?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
}

export const getExaminations = async (
    params?: GetExaminationsParams
): Promise<ExaminationsListResponse> => {
    const response = await bidanApi.get('/api/examinations', { params });
    return response.data;
};

export const getExaminationById = async (
    id: string
): Promise<{ data: Examination }> => {
    const response = await bidanApi.get(`/api/examinations/${id}`);
    return response.data;
};

export const createExamination = async (
    payload: CreateExaminationPayload
): Promise<{ data: Examination }> => {
    const response = await bidanApi.post('/api/examinations', payload);
    return response.data;
};

export const updateExamination = async (
    id: string,
    payload: UpdateExaminationPayload
): Promise<{ data: Examination }> => {
    const response = await bidanApi.put(`/api/examinations/${id}`, payload);
    return response.data;
};

export const deleteExamination = async (
    id: string
): Promise<{ data: Examination }> => {
    const response = await bidanApi.delete(`/api/examinations/${id}`);
    return response.data;
};

