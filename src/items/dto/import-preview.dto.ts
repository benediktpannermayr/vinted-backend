import { ApiProperty } from '@nestjs/swagger';
import { IsUrl, Matches } from 'class-validator';

export class ImportPreviewDto {
  @ApiProperty({ description: 'Ein Vinted-Angebotslink' })
  @IsUrl()
  @Matches(/vinted\./i, { message: 'Nur Vinted-Links werden unterstützt' })
  listingUrl: string;
}
