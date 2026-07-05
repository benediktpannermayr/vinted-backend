import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateWatchlistItemDto {
  @ApiProperty()
  @IsString()
  marketplaceListingId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  note?: string;
}
