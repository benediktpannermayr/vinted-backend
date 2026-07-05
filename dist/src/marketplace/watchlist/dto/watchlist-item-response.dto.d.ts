import { ListingResponseDto } from '../../listings/dto/listing-response.dto';
export declare class WatchlistItemResponseDto {
    id: string;
    note: string | null;
    createdAt: string;
    listing: ListingResponseDto;
    constructor(id: string, note: string | null, createdAt: Date, listing: ListingResponseDto);
}
