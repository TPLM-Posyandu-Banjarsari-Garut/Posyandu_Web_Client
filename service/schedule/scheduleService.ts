import { bidanApi } from '@/service/auth/bidanAuthService';
import {
    ExaminationSchedule,
    SchedulesListResponse,
    CreateSchedulePayload,
    UpdateSchedulePayload
} from '@/interfaces/schedule';

interface GetSchedulesParams {
    posyandu_id?: string;
    examination_id?: string;
    scheduled_date?: string;
    status?: string;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
}

export const getSchedules = async (
    params?: GetSchedulesParams
): Promise<SchedulesListResponse> => {
    const response = await bidanApi.get('/api/examination-schedules', { params });
    return response.data;
};

export const getScheduleById = async (
    id: string
): Promise<{ data: ExaminationSchedule }> => {
    const response = await bidanApi.get(`/api/examination-schedules/${id}`);
    return response.data;
};

export const createSchedule = async (
    payload: CreateSchedulePayload
): Promise<{ data: ExaminationSchedule }> => {
    const response = await bidanApi.post('/api/examination-schedules', payload);
    return response.data;
};

export const updateSchedule = async (
    id: string,
    payload: UpdateSchedulePayload
): Promise<{ data: ExaminationSchedule }> => {
    const response = await bidanApi.put(`/api/examination-schedules/${id}`, payload);
    return response.data;
};

export const deleteSchedule = async (
    id: string
): Promise<{ data: ExaminationSchedule }> => {
    const response = await bidanApi.delete(`/api/examination-schedules/${id}`);
    return response.data;
};
