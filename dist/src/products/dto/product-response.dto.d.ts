import type { ProductWithCounts } from '../repositories/product.repository.interface';
export declare class ProductResponseDto {
    id: string;
    title: string;
    brand: string | null;
    category: string | null;
    notes: string | null;
    searchProfileCount: number;
    listingCount: number;
    createdAt: string;
    updatedAt: string;
    constructor(product: ProductWithCounts);
}
