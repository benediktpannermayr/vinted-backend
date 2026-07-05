import type { ItemStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateItemData, IItemRepository, ItemFilters, ItemQueryOptions, ItemSoldAggregate, ItemStockAggregate, ItemWithProduct, UpdateItemData } from './item.repository.interface';
export declare class PrismaItemRepository implements IItemRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildWhere;
    private buildOrderBy;
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
