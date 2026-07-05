import type { MarketplaceSource } from '@prisma/client';
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
    searchByText(text: string): Promise<RawMarketplaceListing[]>;
}
export declare const MARKETPLACE_PROVIDER = "MARKETPLACE_PROVIDER";
