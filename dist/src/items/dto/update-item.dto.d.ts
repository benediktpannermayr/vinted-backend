import { ItemStatus } from '@prisma/client';
import { CreateItemDto } from './create-item.dto';
declare const UpdateItemDto_base: import("@nestjs/common").Type<Partial<CreateItemDto>>;
export declare class UpdateItemDto extends UpdateItemDto_base {
    status?: typeof ItemStatus.IN_STOCK | typeof ItemStatus.RESERVED;
}
export {};
