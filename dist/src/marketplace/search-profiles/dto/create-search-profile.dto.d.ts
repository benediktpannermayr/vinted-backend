import { ItemCondition } from '@prisma/client';
export declare class CreateSearchProfileDto {
    name: string;
    productId: string;
    sizes?: string[];
    colors?: string[];
    maxPrice?: number;
    condition?: ItemCondition;
    isActive?: boolean;
    refreshIntervalMinutes?: number;
}
