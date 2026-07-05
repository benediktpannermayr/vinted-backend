import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import type { ProductWithCounts } from '../repositories/product.repository.interface';

@Exclude()
export class ProductResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() title: string;
  @Expose() @ApiPropertyOptional() brand: string | null;
  @Expose() @ApiPropertyOptional() category: string | null;
  @Expose() @ApiPropertyOptional() notes: string | null;
  @Expose() @ApiProperty() searchProfileCount: number;
  @Expose() @ApiProperty() listingCount: number;
  @Expose() @ApiProperty() createdAt: string;
  @Expose() @ApiProperty() updatedAt: string;

  constructor(product: ProductWithCounts) {
    this.id = product.id;
    this.title = product.title;
    this.brand = product.brand;
    this.category = product.category;
    this.notes = product.notes;
    this.searchProfileCount = product._count.searchProfiles;
    this.listingCount = product._count.listings;
    this.createdAt = product.createdAt.toISOString();
    this.updatedAt = product.updatedAt.toISOString();
  }
}
