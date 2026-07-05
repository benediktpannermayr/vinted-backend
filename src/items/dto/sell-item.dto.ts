import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class SellItemDto {
  @ApiProperty()
  @IsNumber()
  @IsPositive()
  soldPrice: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  saleShipping?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  saleFees?: number;

  @ApiProperty({ description: 'Kann rückwirkend gesetzt werden' })
  @IsDateString()
  soldDate: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  platform?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  buyer?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;
}
