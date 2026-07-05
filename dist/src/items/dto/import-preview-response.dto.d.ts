import type { ItemCondition } from '@prisma/client';
export type ImportMatchType = 'CACHED' | 'LIVE_SEARCH' | 'NOT_FOUND';
export declare class ImportPreviewResponseDto {
    matchType: ImportMatchType;
    listingUrl: string;
    title: string | null;
    brand: string | null;
    size: string | null;
    condition: ItemCondition | null;
    suggestedPurchasePrice: number | null;
    images: string[];
    seller: string | null;
    constructor(data: {
        matchType: ImportMatchType;
        listingUrl: string;
        title?: string | null;
        brand?: string | null;
        size?: string | null;
        condition?: ItemCondition | null;
        suggestedPurchasePrice?: number | null;
        images?: string[];
        seller?: string | null;
    });
}
