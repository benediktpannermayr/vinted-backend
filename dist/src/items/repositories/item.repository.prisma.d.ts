import type { Item, ItemStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { CreateItemData, IItemRepository, ItemFilters, ItemQueryOptions, UpdateItemData } from './item.repository.interface';
export declare class PrismaItemRepository implements IItemRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildWhere;
    findMany(options: ItemQueryOptions): Promise<Item[]>;
    count(filters: ItemFilters): Promise<number>;
    findById(id: string, userId: string): Promise<Item | null>;
    create(data: CreateItemData): Promise<Item>;
    update(id: string, data: UpdateItemData): Promise<Item>;
    delete(id: string): Promise<void>;
    updateManyStatus(ids: string[], userId: string, status: ItemStatus): Promise<number>;
}
