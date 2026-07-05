import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { IProductRepository, ProductWithCounts } from './product.repository.interface';
export declare class PrismaProductRepository implements IProductRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Promise<ProductWithCounts[]>;
    findById(id: string, userId: string): Promise<ProductWithCounts | null>;
    create(data: Prisma.ProductUncheckedCreateInput): Promise<ProductWithCounts>;
    update(id: string, data: Prisma.ProductUncheckedUpdateInput): Promise<ProductWithCounts>;
    delete(id: string): Promise<void>;
}
