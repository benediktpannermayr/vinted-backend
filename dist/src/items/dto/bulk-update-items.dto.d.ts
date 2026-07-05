import { ItemStatus } from '@prisma/client';
export declare class BulkUpdateItemsDto {
    ids: string[];
    status: typeof ItemStatus.IN_STOCK | typeof ItemStatus.RESERVED;
}
