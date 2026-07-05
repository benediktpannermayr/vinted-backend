import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type { IListingRepository, ListingFilters, ListingQueryOptions, ListingWithProduct } from './listing.repository.interface';
export declare class PrismaListingRepository implements IListingRepository {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private buildWhere;
    findMany(options: ListingQueryOptions): Promise<ListingWithProduct[]>;
    count(filters: ListingFilters): Promise<number>;
    findById(id: string): Promise<ListingWithProduct | null>;
    findByUrl(listingUrl: string): Promise<ListingWithProduct | null>;
    upsert(listingUrl: string, data: Prisma.MarketplaceListingUncheckedCreateInput): Promise<ListingWithProduct>;
}
