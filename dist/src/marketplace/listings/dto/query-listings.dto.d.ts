import { ItemCondition, MarketplaceSource } from '@prisma/client';
declare const SORTABLE_FIELDS: readonly ["detectedAt", "price", "updatedAt"];
export type ListingSortField = (typeof SORTABLE_FIELDS)[number];
export declare class QueryListingsDto {
    search?: string;
    brand?: string;
    category?: string;
    size?: string;
    color?: string;
    productId?: string;
    condition?: ItemCondition;
    maxPrice?: number;
    source?: MarketplaceSource;
    isFavorite?: boolean;
    sortBy: ListingSortField;
    sortOrder: 'asc' | 'desc';
    page: number;
    pageSize: number;
}
export {};
