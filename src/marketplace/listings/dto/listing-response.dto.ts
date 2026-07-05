import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import type { ListingWithProduct } from '../repositories/listing.repository.interface';
import type { ListingScoreResult } from '../scoring/listing-scoring.service';

@Exclude()
export class ListingResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() title: string;
  @Expose() @ApiProperty() price: number;
  @Expose() @ApiPropertyOptional() brand: string | null;
  @Expose() @ApiPropertyOptional() category: string | null;
  @Expose() @ApiPropertyOptional() size: string | null;
  @Expose() @ApiPropertyOptional() color: string | null;
  @Expose() @ApiPropertyOptional() condition: string | null;
  @Expose() @ApiPropertyOptional() productId: string | null;
  @Expose() @ApiPropertyOptional() productTitle: string | null;
  @Expose() @ApiProperty({ type: [String] }) images: string[];
  @Expose() @ApiProperty() listingUrl: string;
  @Expose() @ApiPropertyOptional() seller: string | null;
  @Expose() @ApiPropertyOptional() publishedAt: string | null;
  @Expose() @ApiProperty() isFavorite: boolean;
  @Expose() @ApiProperty() source: string;
  @Expose() @ApiProperty() detectedAt: string;
  @Expose() @ApiProperty() updatedAt: string;

  @Expose() @ApiProperty() score: number;
  @Expose() @ApiProperty() expectedSalePrice: number;
  @Expose() @ApiProperty() expectedProfit: number;
  @Expose() @ApiProperty() expectedMargin: number;
  @Expose() @ApiPropertyOptional() averageDaysToSell: number | null;
  @Expose() @ApiProperty() maxPurchasePrice: number;
  @Expose() @ApiProperty() similarSalesCount: number;
  @Expose() @ApiProperty() recommendation: string;
  @Expose() @ApiProperty() reason: string;

  @Expose() @ApiProperty() isWatchlisted: boolean;

  constructor(
    listing: ListingWithProduct,
    scoreResult: ListingScoreResult,
    isWatchlisted: boolean,
  ) {
    this.id = listing.id;
    this.title = listing.title;
    this.price = Number(listing.price);
    this.brand = listing.brand;
    this.category = listing.category;
    this.size = listing.size;
    this.color = listing.color;
    this.condition = listing.condition;
    this.productId = listing.productId;
    this.productTitle = listing.product?.title ?? null;
    this.images = listing.images;
    this.listingUrl = listing.listingUrl;
    this.seller = listing.seller;
    this.publishedAt = listing.publishedAt
      ? listing.publishedAt.toISOString()
      : null;
    this.isFavorite = listing.isFavorite;
    this.source = listing.source;
    this.detectedAt = listing.detectedAt.toISOString();
    this.updatedAt = listing.updatedAt.toISOString();

    this.score = scoreResult.score;
    this.expectedSalePrice = scoreResult.expectedSalePrice;
    this.expectedProfit = scoreResult.expectedProfit;
    this.expectedMargin = scoreResult.expectedMargin;
    this.averageDaysToSell = scoreResult.averageDaysToSell;
    this.maxPurchasePrice = scoreResult.maxPurchasePrice;
    this.similarSalesCount = scoreResult.similarSalesCount;
    this.recommendation = scoreResult.recommendation;
    this.reason = scoreResult.reason;

    this.isWatchlisted = isWatchlisted;
  }
}
