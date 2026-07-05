import type { MarketplaceListing, Prisma } from '@prisma/client';
export type ListingWithProduct = MarketplaceListing & {
    product: {
        id: string;
        title: string;
    } | null;
};
export interface ListingFilters {
    search?: string;
    brand?: string;
    category?: string;
    size?: string;
    color?: string;
    condition?: string;
    maxPrice?: number;
    source?: string;
    isFavorite?: boolean;
    productId?: string;
}
export interface ListingQueryOptions extends ListingFilters {
    sortBy: 'detectedAt' | 'price' | 'updatedAt';
    sortOrder: 'asc' | 'desc';
    skip: number;
    take: number;
}
export interface IListingRepository {
    findMany(options: ListingQueryOptions): Promise<ListingWithProduct[]>;
    count(filters: ListingFilters): Promise<number>;
    findById(id: string): Promise<ListingWithProduct | null>;
    findByUrl(listingUrl: string): Promise<ListingWithProduct | null>;
    upsert(listingUrl: string, data: Prisma.MarketplaceListingUncheckedCreateInput): Promise<ListingWithProduct>;
}
export declare const LISTING_REPOSITORY = "LISTING_REPOSITORY";
