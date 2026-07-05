import { ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { ItemStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateItemDto } from './create-item.dto';

// SOLD is intentionally not settable here — selling an item must go through
// POST /items/:id/sell so a matching Sale record is always created.
export class UpdateItemDto extends PartialType(CreateItemDto) {
  @ApiPropertyOptional({ enum: [ItemStatus.IN_STOCK, ItemStatus.RESERVED] })
  @IsOptional()
  @IsEnum(ItemStatus)
  status?: typeof ItemStatus.IN_STOCK | typeof ItemStatus.RESERVED;
}
