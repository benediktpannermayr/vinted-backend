import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type {
  IProductRepository,
  ProductWithCounts,
} from './product.repository.interface';

const WITH_COUNTS = {
  include: { _count: { select: { searchProfiles: true, listings: true } } },
} as const;

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllForUser(userId: string): Promise<ProductWithCounts[]> {
    return this.prisma.product.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      ...WITH_COUNTS,
    });
  }

  findById(id: string, userId: string): Promise<ProductWithCounts | null> {
    return this.prisma.product.findFirst({
      where: { id, userId },
      ...WITH_COUNTS,
    });
  }

  create(data: Prisma.ProductUncheckedCreateInput): Promise<ProductWithCounts> {
    return this.prisma.product.create({ data, ...WITH_COUNTS });
  }

  update(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<ProductWithCounts> {
    return this.prisma.product.update({ where: { id }, data, ...WITH_COUNTS });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }
}
