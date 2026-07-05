import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import type { Item } from '@prisma/client';
import { Exclude, Expose } from 'class-transformer';

function toNumber(value: unknown): number | null {
  if (value === null || value === undefined) return null;
  return Number(value);
}

function toDateOnly(value: Date | null): string | null {
  return value ? value.toISOString() : null;
}

@Exclude()
export class ItemResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiProperty() title: string;
  @Expose() @ApiPropertyOptional() brand: string | null;
  @Expose() @ApiPropertyOptional() category: string | null;
  @Expose() @ApiPropertyOptional() size: string | null;
  @Expose() @ApiPropertyOptional() condition: string | null;
  @Expose() @ApiPropertyOptional() color: string | null;
  @Expose() @ApiPropertyOptional() description: string | null;
  @Expose() @ApiPropertyOptional() notes: string | null;

  @Expose() @ApiPropertyOptional() purchasePrice: number | null;
  @Expose() @ApiPropertyOptional() purchaseShipping: number | null;
  @Expose() @ApiPropertyOptional() purchaseFees: number | null;
  @Expose() @ApiPropertyOptional() expectedSalePrice: number | null;
  @Expose() @ApiPropertyOptional() soldPrice: number | null;
  @Expose() @ApiPropertyOptional() saleShipping: number | null;
  @Expose() @ApiPropertyOptional() saleFees: number | null;

  @Expose() @ApiPropertyOptional() purchaseDate: string | null;
  @Expose() @ApiPropertyOptional() soldDate: string | null;

  @Expose() @ApiProperty() status: string;
  @Expose() @ApiProperty({ type: [String] }) images: string[];
  @Expose() @ApiPropertyOptional() sourceListingUrl: string | null;

  @Expose() @ApiProperty() createdAt: string;
  @Expose() @ApiProperty() updatedAt: string;

  @Expose()
  @ApiPropertyOptional({
    description: 'Gewinn in EUR, nur bei verkauften Artikeln',
  })
  profit: number | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Marge in %, nur bei verkauften Artikeln',
  })
  margin: number | null;

  @Expose()
  @ApiPropertyOptional({
    description: 'Tage im Lager (bis heute oder bis Verkaufsdatum)',
  })
  daysInStock: number;

  constructor(item: Item) {
    this.id = item.id;
    this.title = item.title;
    this.brand = item.brand;
    this.category = item.category;
    this.size = item.size;
    this.condition = item.condition;
    this.color = item.color;
    this.description = item.description;
    this.notes = item.notes;

    this.purchasePrice = toNumber(item.purchasePrice);
    this.purchaseShipping = toNumber(item.purchaseShipping);
    this.purchaseFees = toNumber(item.purchaseFees);
    this.expectedSalePrice = toNumber(item.expectedSalePrice);
    this.soldPrice = toNumber(item.soldPrice);
    this.saleShipping = toNumber(item.saleShipping);
    this.saleFees = toNumber(item.saleFees);

    this.purchaseDate = toDateOnly(item.purchaseDate);
    this.soldDate = toDateOnly(item.soldDate);

    this.status = item.status;
    this.images = item.images;
    this.sourceListingUrl = item.sourceListingUrl;

    this.createdAt = item.createdAt.toISOString();
    this.updatedAt = item.updatedAt.toISOString();

    const totalCost =
      (this.purchasePrice ?? 0) +
      (this.purchaseShipping ?? 0) +
      (this.purchaseFees ?? 0);

    if (this.soldPrice !== null) {
      const netSale =
        this.soldPrice - (this.saleShipping ?? 0) - (this.saleFees ?? 0);
      this.profit = netSale - totalCost;
      this.margin =
        this.soldPrice > 0 ? (this.profit / this.soldPrice) * 100 : null;
    } else {
      this.profit = null;
      this.margin = null;
    }

    const end = item.soldDate ?? new Date();
    const start = item.purchaseDate ?? item.createdAt;
    this.daysInStock = Math.max(
      0,
      Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
    );
  }
}
