import { ItemCondition } from '@prisma/client';
export declare class CreateItemDto {
    title: string;
    brand?: string;
    category?: string;
    size?: string;
    condition?: ItemCondition;
    color?: string;
    description?: string;
    notes?: string;
    purchasePrice: number;
    purchaseShipping?: number;
    purchaseFees?: number;
    expectedSalePrice?: number;
    purchaseDate: string;
    sourceListingUrl?: string;
    importImageUrls?: string[];
}
