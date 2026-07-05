import { ItemCondition, ItemStatus } from '@prisma/client';
declare const SORTABLE_FIELDS: readonly ["createdAt", "purchaseDate", "soldDate", "purchasePrice", "productTitle"];
export type ItemSortField = (typeof SORTABLE_FIELDS)[number];
export declare class QueryItemsDto {
    search?: string;
    status?: ItemStatus;
    productId?: string;
    size?: string;
    condition?: ItemCondition;
    sortBy: ItemSortField;
    sortOrder: 'asc' | 'desc';
    page: number;
    pageSize: number;
}
export {};
