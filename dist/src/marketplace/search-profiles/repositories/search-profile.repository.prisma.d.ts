import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type { ISearchProfileRepository, SearchProfileWithProduct } from './search-profile.repository.interface';
export declare class PrismaSearchProfileRepository implements ISearchProfileRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAllForUser(userId: string): Promise<SearchProfileWithProduct[]>;
    findById(id: string, userId: string): Promise<SearchProfileWithProduct | null>;
    create(data: Prisma.SearchProfileUncheckedCreateInput): Promise<SearchProfileWithProduct>;
    update(id: string, data: Prisma.SearchProfileUncheckedUpdateInput): Promise<SearchProfileWithProduct>;
    delete(id: string): Promise<void>;
    findActive(): Promise<SearchProfileWithProduct[]>;
    markRun(id: string, ranAt: Date): Promise<void>;
}
