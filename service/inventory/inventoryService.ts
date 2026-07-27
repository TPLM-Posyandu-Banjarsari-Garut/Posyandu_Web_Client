import { bidanApi } from '@/service/auth/bidanAuthService';
import {
    InventoryResponse,
    InventoriesListResponse,
    CreateInventoryPayload,
    UpdateInventoryPayload,
    GetInventoriesParams
} from '@/interfaces/inventory';

export const getInventories = async (params?: GetInventoriesParams): Promise<InventoriesListResponse> => {
    const { data } = await bidanApi.get<InventoriesListResponse>('/api/inventories', { params });
    return data;
};

export const getInventoryById = async (id: string): Promise<InventoryResponse> => {
    const { data } = await bidanApi.get<InventoryResponse>(`/api/inventories/${id}`);
    return data;
};

export const createInventory = async (payload: CreateInventoryPayload): Promise<InventoryResponse> => {
    const { data } = await bidanApi.post<InventoryResponse>('/api/inventories', payload);
    return data;
};

export const updateInventory = async (id: string, payload: UpdateInventoryPayload): Promise<InventoryResponse> => {
    const { data } = await bidanApi.put<InventoryResponse>(`/api/inventories/${id}`, payload);
    return data;
};

export const deleteInventory = async (id: string, permanent?: boolean): Promise<{ success: boolean; message: string }> => {
    const { data } = await bidanApi.delete<{ success: boolean; message: string }>(`/api/inventories/${id}`, {
        params: { permanent }
    });
    return data;
};

export const restoreInventory = async (id: string): Promise<InventoryResponse> => {
    const { data } = await bidanApi.post<InventoryResponse>(`/api/inventories/${id}/restore`);
    return data;
};
