import type { MarketplaceSource } from '@prisma/client';

// Raw shape returned by a marketplace provider before it's mapped onto our
// MarketplaceListing model. Kept separate from the Prisma model so a new
// provider only needs to produce this shape — the mapping/upsert logic in
// MarketplaceSyncService stays provider-agnostic. externalId is the
// provider's own item identifier (e.g. Vinted's numeric item id), used to
// match a specific listing found via a text search (see IMarketplaceProvider.
// searchByText, used by the link-import feature).
export interface RawMarketplaceListing {
  externalId: string | null;
  title: string;
  price: number;
  brand: string | null;
  category: string | null;
  size: string | null;
  color: string | null;
  condition: string | null;
  images: string[];
  listingUrl: string;
  seller: string | null;
  publishedAt: Date | null;
}

// Search criteria decoupled from our Prisma SearchProfile/Product models —
// keeps the provider boundary free of persistence types and keeps provider
// tests free of Prisma fixtures.
export interface MarketplaceSearchCriteria {
  profileName: string;
  productTitle: string;
  brand: string | null;
  category: string | null;
  sizes: string[];
  colors: string[];
  maxPrice: number | null;
}

export interface IMarketplaceProvider {
  readonly source: MarketplaceSource;
  search(criteria: MarketplaceSearchCriteria): Promise<RawMarketplaceListing[]>;
  /** Free-text search without price constraints — used by the link-import feature to re-find a specific item by its slug words. */
  searchByText(text: string): Promise<RawMarketplaceListing[]>;
}

// Single active provider for now (Vinted). Swapping or adding a marketplace
// means implementing IMarketplaceProvider and rebinding this token — call
// sites never depend on the concrete provider.
export const MARKETPLACE_PROVIDER = 'MARKETPLACE_PROVIDER';
