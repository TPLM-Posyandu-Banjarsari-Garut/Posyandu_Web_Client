import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
    getInventories,
    getInventoryById,
    createInventory,
    updateInventory,
    deleteInventory
} from '@/service/inventory/inventoryService';
import { CreateInventoryPayload, UpdateInventoryPayload, GetInventoriesParams } from '@/interfaces/inventory';

export const useGetInventories = (params?: GetInventoriesParams) => {
    return useQuery({
        queryKey: ['inventories', params],
        queryFn: () => getInventories(params),
        staleTime: 5 * 60 * 1000,
    });
};

export const useGetInventoryById = (id: string) => {
    return useQuery({
        queryKey: ['inventories', id],
        queryFn: () => getInventoryById(id),
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
    });
};

export const useCreateInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (payload: CreateInventoryPayload) => createInventory(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};

export const useUpdateInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: UpdateInventoryPayload }) =>
            updateInventory(id, payload),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
            queryClient.invalidateQueries({ queryKey: ['inventories', variables.id] });
        },
    });
};

export const useDeleteInventory = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, permanent }: { id: string, permanent?: boolean }) => deleteInventory(id, permanent),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['inventories'] });
        },
    });
};
