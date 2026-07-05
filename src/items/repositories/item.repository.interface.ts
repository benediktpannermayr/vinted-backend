import type { Item, ItemStatus, Prisma } from '@prisma/client';
import type { ItemSortField } from '../dto/query-items.dto';

export interface ItemFilters {
  userId: string;
  search?: string;
  status?: ItemStatus;
  brand?: string;
  category?: string;
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

export interface IItemRepository {
  findMany(options: ItemQueryOptions): Promise<Item[]>;
  count(filters: ItemFilters): Promise<number>;
  findById(id: string, userId: string): Promise<Item | null>;
  create(data: CreateItemData): Promise<Item>;
  update(id: string, data: UpdateItemData): Promise<Item>;
  delete(id: string): Promise<void>;
  updateManyStatus(
    ids: string[],
    userId: string,
    status: ItemStatus,
  ): Promise<number>;
}

export const ITEM_REPOSITORY = 'ITEM_REPOSITORY';
