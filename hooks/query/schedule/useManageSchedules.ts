import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '@/service/schedule/scheduleService';
import { CreateSchedulePayload, UpdateSchedulePayload } from '@/interfaces/schedule';

export const useGetSchedules = (params?: {
    posyandu_id?: string;
    examination_id?: string;
    scheduled_date?: string;
    status?: string;
    page?: number;
    limit?: number;
    order?: 'asc' | 'desc';
}) => {
    return useQuery({
        queryKey: ['schedules', params],
        queryFn: () => getSchedules(params),
    });
};

export const useGetScheduleById = (id: string) => {
    return useQuery({
        queryKey: ['schedules', id],
        queryFn: () => getScheduleById(id),
        enabled: !!id,
    });
};

export const useCreateSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateSchedulePayload) => createSchedule(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        },
    });
};

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateSchedulePayload }) =>
            updateSchedule(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
            queryClient.invalidateQueries({ queryKey: ['schedules', variables.id] });
        },
    });
};

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['schedules'] });
        },
    });
};
