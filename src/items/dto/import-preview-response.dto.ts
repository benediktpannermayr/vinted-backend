import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { ItemCondition } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

export type ImportMatchType = 'CACHED' | 'LIVE_SEARCH' | 'NOT_FOUND';

@Exclude()
export class ImportPreviewResponseDto {
  @Expose()
  @ApiProperty({ enum: ['CACHED', 'LIVE_SEARCH', 'NOT_FOUND'] })
  matchType: ImportMatchType;

  @Expose() @ApiProperty() listingUrl: string;
  @Expose() @ApiPropertyOptional() title: string | null;
  @Expose() @ApiPropertyOptional() brand: string | null;
  @Expose() @ApiPropertyOptional() size: string | null;
  @Expose() @ApiPropertyOptional() condition: ItemCondition | null;
  @Expose() @ApiPropertyOptional() suggestedPurchasePrice: number | null;
  @Expose() @ApiProperty({ type: [String] }) images: string[];
  @Expose() @ApiPropertyOptional() seller: string | null;

  constructor(data: {
    matchType: ImportMatchType;
    listingUrl: string;
    title?: string | null;
    brand?: string | null;
    size?: string | null;
    condition?: ItemCondition | null;
    suggestedPurchasePrice?: number | null;
    images?: string[];
    seller?: string | null;
  }) {
    this.matchType = data.matchType;
    this.listingUrl = data.listingUrl;
    this.title = data.title ?? null;
    this.brand = data.brand ?? null;
    this.size = data.size ?? null;
    this.condition = data.condition ?? null;
    this.suggestedPurchasePrice = data.suggestedPurchasePrice ?? null;
    this.images = data.images ?? [];
    this.seller = data.seller ?? null;
  }
}
