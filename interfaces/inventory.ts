export type InventoryItemType = 'vaccine' | 'vitamin' | 'general';
export type InventoryUnit = 'pcs' | 'box' | 'bottle' | 'pack' | 'set';
export type InventoryCondition = 'good' | 'minor_damage' | 'major_damage' | 'out_of_stock' | 'under_repair';

export interface Inventory {
    id: string;
    posyandu_id: string;
    item_name: string;
    item_type: InventoryItemType;
    description: string | null;
    quantity: number;
    unit: InventoryUnit;
    condition: InventoryCondition;
    batch_number: string | null;
    expiry_date: string | null;
    last_checked_date: string | null;
    managed_by_midwife_id: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface GetInventoriesParams {
    page?: number;
    limit?: number;
    search?: string;
    item_type?: InventoryItemType;
    condition?: InventoryCondition;
    posyandu_id?: string;
    includeDeleted?: boolean;
}

export interface InventoryResponse {
    success: boolean;
    message: string;
    data: Inventory;
}

export interface InventoriesListResponse {
    success: boolean;
    message: string;
    data: Inventory[];
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreateInventoryPayload {
    posyandu_id: string;
    item_name: string;
    item_type?: InventoryItemType;
    description?: string;
    quantity?: number;
    unit?: InventoryUnit;
    condition?: InventoryCondition;
    batch_number?: string;
    expiry_date?: string;
    last_checked_date?: string;
    managed_by_midwife_id?: string;
    notes?: string;
}

export interface UpdateInventoryPayload extends Partial<CreateInventoryPayload> {}
