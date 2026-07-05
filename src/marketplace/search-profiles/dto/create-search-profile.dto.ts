import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ItemCondition } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateSearchProfileDto {
  @ApiProperty()
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ description: 'Das Produkt, für das dieses Suchprofil läuft' })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    type: [String],
    description: 'Optionale Größen-Eingrenzung',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sizes?: string[];

  @ApiPropertyOptional({
    type: [String],
    description: 'Optionale Farb-Eingrenzung',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  colors?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ItemCondition })
  @IsOptional()
  @IsEnum(ItemCondition)
  condition?: ItemCondition;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    default: 60,
    minimum: 15,
    description:
      'Minimales Intervall 15 Minuten, um Vinted nicht zu überlasten',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(15)
  refreshIntervalMinutes?: number;
}
