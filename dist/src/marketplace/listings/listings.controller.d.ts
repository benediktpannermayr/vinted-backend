import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { QueryListingsDto } from './dto/query-listings.dto';
import { ListingsService } from './listings.service';
export declare class ListingsController {
    private readonly listingsService;
    constructor(listingsService: ListingsService);
    findAll(user: AuthenticatedUser, query: QueryListingsDto): Promise<import("./listings.service").PaginatedListings>;
    findOne(id: string, user: AuthenticatedUser): Promise<import("./dto/listing-response.dto").ListingResponseDto>;
}
