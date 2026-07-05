import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemCondition } from '@prisma/client';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  IsUUID,
} from 'class-validator';

export class CreateItemDto {
  @ApiProperty({ description: 'Das Produkt, dem dieser Lagerartikel zugeordnet ist' })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  size?: string;

  @ApiPropertyOptional({ enum: ItemCondition })
  @IsOptional()
  @IsEnum(ItemCondition)
  condition?: ItemCondition;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  color?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Einkaufspreis in EUR' })
  @IsNumber()
  @IsPositive()
  purchasePrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  purchaseShipping?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  purchaseFees?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @IsPositive()
  expectedSalePrice?: number;

  @ApiProperty({ description: 'Kann rückwirkend gesetzt werden' })
  @IsDateString()
  purchaseDate: string;

  @ApiPropertyOptional({
    description: 'Herkunfts-Link, falls per Link importiert',
  })
  @IsOptional()
  @IsUrl()
  sourceListingUrl?: string;

  @ApiPropertyOptional({
    type: [String],
    description:
      'Externe Bild-URLs, die beim Anlegen heruntergeladen und gespeichert werden',
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  importImageUrls?: string[];
}
