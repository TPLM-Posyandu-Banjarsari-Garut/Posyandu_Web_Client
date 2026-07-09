import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
    getExaminations, 
    getExaminationById,
    createExamination,
    updateExamination,
    deleteExamination
} from '@/service/examination/examinationService';
import { CreateExaminationPayload, UpdateExaminationPayload } from '@/interfaces/examination';

export const useGetExaminations = (params?: {
    posyandu_id?: string;
    is_active?: boolean;
    page?: number;
    limit?: number;
}) => {
    return useQuery({
        queryKey: ['examinations', params],
        queryFn: () => getExaminations(params),
    });
};

export const useGetExaminationById = (id: string) => {
    return useQuery({
        queryKey: ['examinations', id],
        queryFn: () => getExaminationById(id),
        enabled: !!id,
    });
};

export const useCreateExamination = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateExaminationPayload) => createExamination(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examinations'] });
        },
    });
};

export const useUpdateExamination = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateExaminationPayload }) =>
            updateExamination(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['examinations'] });
            queryClient.invalidateQueries({ queryKey: ['examinations', variables.id] });
        },
    });
};

export const useDeleteExamination = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteExamination(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['examinations'] });
        },
    });
};

