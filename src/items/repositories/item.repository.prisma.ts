import { Injectable } from '@nestjs/common';
import type { Item, ItemStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateItemData,
  IItemRepository,
  ItemFilters,
  ItemQueryOptions,
  UpdateItemData,
} from './item.repository.interface';

@Injectable()
export class PrismaItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filters: ItemFilters): Prisma.ItemWhereInput {
    return {
      userId: filters.userId,
      status: filters.status,
      brand: filters.brand
        ? { equals: filters.brand, mode: 'insensitive' }
        : undefined,
      category: filters.category
        ? { equals: filters.category, mode: 'insensitive' }
        : undefined,
      size: filters.size
        ? { equals: filters.size, mode: 'insensitive' }
        : undefined,
      condition: filters.condition as never,
      title: filters.search
        ? { contains: filters.search, mode: 'insensitive' }
        : undefined,
    };
  }

  findMany(options: ItemQueryOptions): Promise<Item[]> {
    return this.prisma.item.findMany({
      where: this.buildWhere(options),
      orderBy: { [options.sortBy]: options.sortOrder },
      skip: options.skip,
      take: options.take,
    });
  }

  count(filters: ItemFilters): Promise<number> {
    return this.prisma.item.count({ where: this.buildWhere(filters) });
  }

  findById(id: string, userId: string): Promise<Item | null> {
    return this.prisma.item.findFirst({ where: { id, userId } });
  }

  create(data: CreateItemData): Promise<Item> {
    return this.prisma.item.create({ data });
  }

  update(id: string, data: UpdateItemData): Promise<Item> {
    return this.prisma.item.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.item.delete({ where: { id } });
  }

  async updateManyStatus(
    ids: string[],
    userId: string,
    status: ItemStatus,
  ): Promise<number> {
    const result = await this.prisma.item.updateMany({
      where: { id: { in: ids }, userId },
      data: { status },
    });
    return result.count;
  }
}
