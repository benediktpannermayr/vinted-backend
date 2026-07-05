import type { ItemWithProduct } from '../repositories/item.repository.interface';
declare class ItemProductDto {
    id: string;
    title: string;
    brand: string | null;
    category: string | null;
}
export declare class ItemResponseDto {
    id: string;
    productId: string;
    product: ItemProductDto;
    size: string | null;
    condition: string | null;
    color: string | null;
    description: string | null;
    notes: string | null;
    purchasePrice: number | null;
    purchaseShipping: number | null;
    purchaseFees: number | null;
    expectedSalePrice: number | null;
    soldPrice: number | null;
    saleShipping: number | null;
    saleFees: number | null;
    purchaseDate: string | null;
    soldDate: string | null;
    status: string;
    images: string[];
    sourceListingUrl: string | null;
    createdAt: string;
    updatedAt: string;
    profit: number | null;
    margin: number | null;
    daysInStock: number;
    constructor(item: ItemWithProduct);
}
export {};
