import { ApiProperty } from '@nestjs/swagger';
import { ItemStatus } from '@prisma/client';
import { ArrayMinSize, IsArray, IsEnum, IsString } from 'class-validator';

export class BulkUpdateItemsDto {
  @ApiProperty({ type: [String] })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  ids: string[];

  @ApiProperty({ enum: [ItemStatus.IN_STOCK, ItemStatus.RESERVED] })
  @IsEnum(ItemStatus)
  status: typeof ItemStatus.IN_STOCK | typeof ItemStatus.RESERVED;
}
