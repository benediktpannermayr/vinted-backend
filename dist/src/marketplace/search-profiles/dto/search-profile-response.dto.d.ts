import type { SearchProfileWithProduct } from '../repositories/search-profile.repository.interface';
declare class SearchProfileProductDto {
    id: string;
    title: string;
    brand: string | null;
    category: string | null;
}
export declare class SearchProfileResponseDto {
    id: string;
    name: string;
    productId: string;
    product: SearchProfileProductDto;
    sizes: string[];
    colors: string[];
    maxPrice: number | null;
    condition: string | null;
    isActive: boolean;
    refreshIntervalMinutes: number;
    lastRunAt: string | null;
    createdAt: string;
    updatedAt: string;
    constructor(profile: SearchProfileWithProduct);
}
export {};
