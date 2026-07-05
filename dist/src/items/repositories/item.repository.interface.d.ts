import type { Item, ItemStatus, Prisma, Product } from '@prisma/client';
import type { ItemSortField } from '../dto/query-items.dto';
export type ItemWithProduct = Item & {
    product: Product;
};
export interface ItemFilters {
    userId: string;
    search?: string;
    status?: ItemStatus;
    productId?: string;
    size?: string;
    condition?: string;
}
export interface ItemQueryOptions extends ItemFilters {
    sortBy: ItemSortField;
    sortOrder: 'asc' | 'desc';
    skip: number;
    take: number;
}
export type CreateItemData = Prisma.ItemUncheckedCreateInput;
export type UpdateItemData = Prisma.ItemUncheckedUpdateInput;
export interface ItemSoldAggregate {
    soldPriceSum: number;
    saleShippingSum: number;
    saleFeesSum: number;
    purchasePriceSum: number;
    purchaseShippingSum: number;
    purchaseFeesSum: number;
}
export interface ItemStockAggregate {
    purchasePriceSum: number;
    purchaseShippingSum: number;
    purchaseFeesSum: number;
    count: number;
}
export interface IItemRepository {
    findMany(options: ItemQueryOptions): Promise<ItemWithProduct[]>;
    count(filters: ItemFilters): Promise<number>;
    findById(id: string, userId: string): Promise<ItemWithProduct | null>;
    create(data: CreateItemData): Promise<ItemWithProduct>;
    update(id: string, data: UpdateItemData): Promise<ItemWithProduct>;
    delete(id: string): Promise<void>;
    updateManyStatus(ids: string[], userId: string, status: ItemStatus): Promise<number>;
    aggregateSold(userId: string, from: Date, to: Date): Promise<ItemSoldAggregate>;
    aggregateStock(userId: string): Promise<ItemStockAggregate>;
}
export declare const ITEM_REPOSITORY = "ITEM_REPOSITORY";
