import { PrismaService } from '../../prisma/prisma.service';
import { ListingResponseDto } from './dto/listing-response.dto';
import type { QueryListingsDto } from './dto/query-listings.dto';
import { type IListingRepository } from './repositories/listing.repository.interface';
import { ListingScoringService } from './scoring/listing-scoring.service';
export interface PaginatedListings {
    items: ListingResponseDto[];
    total: number;
    page: number;
    pageSize: number;
}
export declare class ListingsService {
    private readonly listingRepository;
    private readonly scoringService;
    private readonly prisma;
    constructor(listingRepository: IListingRepository, scoringService: ListingScoringService, prisma: PrismaService);
    findAll(userId: string, query: QueryListingsDto): Promise<PaginatedListings>;
    findOne(id: string, userId: string): Promise<ListingResponseDto>;
    private findRecentSoldItems;
    private findWatchlistedIds;
    private findSimilarSales;
}
