import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import type { SearchProfileWithProduct } from '../repositories/search-profile.repository.interface';

class SearchProfileProductDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() title: string;
  @Expose() @ApiPropertyOptional() brand: string | null;
  @Expose() @ApiPropertyOptional() category: string | null;
}

@Exclude()
export class SearchProfileResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() name: string;
  @Expose() @ApiProperty() productId: string;
  @Expose()
  @ApiProperty({ type: SearchProfileProductDto })
  product: SearchProfileProductDto;
  @Expose() @ApiProperty({ type: [String] }) sizes: string[];
  @Expose() @ApiProperty({ type: [String] }) colors: string[];
  @Expose() @ApiPropertyOptional() maxPrice: number | null;
  @Expose() @ApiPropertyOptional() condition: string | null;
  @Expose() @ApiProperty() isActive: boolean;
  @Expose() @ApiProperty() refreshIntervalMinutes: number;
  @Expose() @ApiPropertyOptional() lastRunAt: string | null;
  @Expose() @ApiProperty() createdAt: string;
  @Expose() @ApiProperty() updatedAt: string;

  constructor(profile: SearchProfileWithProduct) {
    this.id = profile.id;
    this.name = profile.name;
    this.productId = profile.productId;
    this.product = {
      id: profile.product.id,
      title: profile.product.title,
      brand: profile.product.brand,
      category: profile.product.category,
    };
    this.sizes = profile.sizes;
    this.colors = profile.colors;
    this.maxPrice = profile.maxPrice === null ? null : Number(profile.maxPrice);
    this.condition = profile.condition;
    this.isActive = profile.isActive;
    this.refreshIntervalMinutes = profile.refreshIntervalMinutes;
    this.lastRunAt = profile.lastRunAt ? profile.lastRunAt.toISOString() : null;
    this.createdAt = profile.createdAt.toISOString();
    this.updatedAt = profile.updatedAt.toISOString();
  }
}
