import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { ListingResponseDto } from '../../listings/dto/listing-response.dto';

@Exclude()
export class WatchlistItemResponseDto {
  @Expose() @ApiProperty() id: string;
  @Expose() @ApiPropertyOptional() note: string | null;
  @Expose() @ApiProperty() createdAt: string;
  @Expose()
  @ApiProperty({ type: ListingResponseDto })
  @Type(() => ListingResponseDto)
  listing: ListingResponseDto;

  constructor(
    id: string,
    note: string | null,
    createdAt: Date,
    listing: ListingResponseDto,
  ) {
    this.id = id;
    this.note = note;
    this.createdAt = createdAt.toISOString();
    this.listing = listing;
  }
}
