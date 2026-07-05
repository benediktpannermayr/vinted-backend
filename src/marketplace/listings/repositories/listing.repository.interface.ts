import type { MarketplaceListing, Prisma } from '@prisma/client';

export type ListingWithProduct = MarketplaceListing & {
  product: { id: string; title: string } | null;
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
  /**
   * Creates the listing if it doesn't exist yet. On update, every field is
   * refreshed EXCEPT productId: once a listing has a non-null productId, it
   * is never overwritten by a later sync run — this is what lets two
   * different products' search profiles surface the same underlying listing
   * without it "flipping" between products on every cron tick. A listing
   * that currently has no productId (e.g. one seeded by the link-import
   * cache lookup) can still be claimed by a later matching search profile.
   */
  upsert(
    listingUrl: string,
    data: Prisma.MarketplaceListingUncheckedCreateInput,
  ): Promise<ListingWithProduct>;
}

export const LISTING_REPOSITORY = 'LISTING_REPOSITORY';
