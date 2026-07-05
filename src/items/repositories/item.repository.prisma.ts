import { Injectable } from '@nestjs/common';
import type { ItemStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  CreateItemData,
  IItemRepository,
  ItemFilters,
  ItemQueryOptions,
  ItemSoldAggregate,
  ItemStockAggregate,
  ItemWithProduct,
  UpdateItemData,
} from './item.repository.interface';
import type { ItemSortField } from '../dto/query-items.dto';

const WITH_PRODUCT = { include: { product: true } } as const;

@Injectable()
export class PrismaItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(filters: ItemFilters): Prisma.ItemWhereInput {
    return {
      userId: filters.userId,
      status: filters.status,
      productId: filters.productId,
      size: filters.size
        ? { equals: filters.size, mode: 'insensitive' }
        : undefined,
      condition: filters.condition as never,
      product: filters.search
        ? { title: { contains: filters.search, mode: 'insensitive' } }
        : undefined,
    };
  }

  private buildOrderBy(
    sortBy: ItemSortField,
    sortOrder: 'asc' | 'desc',
  ): Prisma.ItemOrderByWithRelationInput {
    if (sortBy === 'productTitle') {
      return { product: { title: sortOrder } };
    }
    return { [sortBy]: sortOrder };
  }

  findMany(options: ItemQueryOptions): Promise<ItemWithProduct[]> {
    return this.prisma.item.findMany({
      where: this.buildWhere(options),
      orderBy: this.buildOrderBy(options.sortBy, options.sortOrder),
      skip: options.skip,
      take: options.take,
      ...WITH_PRODUCT,
    });
  }

  count(filters: ItemFilters): Promise<number> {
    return this.prisma.item.count({ where: this.buildWhere(filters) });
  }

  findById(id: string, userId: string): Promise<ItemWithProduct | null> {
    return this.prisma.item.findFirst({
      where: { id, userId },
      ...WITH_PRODUCT,
    });
  }

  create(data: CreateItemData): Promise<ItemWithProduct> {
    return this.prisma.item.create({ data, ...WITH_PRODUCT });
  }

  update(id: string, data: UpdateItemData): Promise<ItemWithProduct> {
    return this.prisma.item.update({
      where: { id },
      data,
      ...WITH_PRODUCT,
    });
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

  async aggregateSold(
    userId: string,
    from: Date,
    to: Date,
  ): Promise<ItemSoldAggregate> {
    const result = await this.prisma.item.aggregate({
      where: { userId, status: 'SOLD', soldDate: { gte: from, lt: to } },
      _sum: {
        soldPrice: true,
        saleShipping: true,
        saleFees: true,
        purchasePrice: true,
        purchaseShipping: true,
        purchaseFees: true,
      },
    });
    return {
      soldPriceSum: Number(result._sum.soldPrice ?? 0),
      saleShippingSum: Number(result._sum.saleShipping ?? 0),
      saleFeesSum: Number(result._sum.saleFees ?? 0),
      purchasePriceSum: Number(result._sum.purchasePrice ?? 0),
      purchaseShippingSum: Number(result._sum.purchaseShipping ?? 0),
      purchaseFeesSum: Number(result._sum.purchaseFees ?? 0),
    };
  }

  async aggregateStock(userId: string): Promise<ItemStockAggregate> {
    const result = await this.prisma.item.aggregate({
      where: { userId, status: { not: 'SOLD' } },
      _sum: {
        purchasePrice: true,
        purchaseShipping: true,
        purchaseFees: true,
      },
      _count: true,
    });
    return {
      purchasePriceSum: Number(result._sum.purchasePrice ?? 0),
      purchaseShippingSum: Number(result._sum.purchaseShipping ?? 0),
      purchaseFeesSum: Number(result._sum.purchaseFees ?? 0),
      count: result._count,
    };
  }
}
