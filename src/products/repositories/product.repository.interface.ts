import type { Prisma, Product } from '@prisma/client';

export type ProductWithCounts = Product & {
  _count: { searchProfiles: number; listings: number };
};

export interface IProductRepository {
  findAllForUser(userId: string): Promise<ProductWithCounts[]>;
  findById(id: string, userId: string): Promise<ProductWithCounts | null>;
  create(data: Prisma.ProductUncheckedCreateInput): Promise<ProductWithCounts>;
  update(
    id: string,
    data: Prisma.ProductUncheckedUpdateInput,
  ): Promise<ProductWithCounts>;
  delete(id: string): Promise<void>;
}

export const PRODUCT_REPOSITORY = 'PRODUCT_REPOSITORY';
