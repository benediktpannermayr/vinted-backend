import { PrismaService } from '../../prisma/prisma.service';
import { ListingsService } from '../listings/listings.service';
import type { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { WatchlistItemResponseDto } from './dto/watchlist-item-response.dto';
export declare class WatchlistService {
    private readonly prisma;
    private readonly listingsService;
    constructor(prisma: PrismaService, listingsService: ListingsService);
    findAll(userId: string): Promise<WatchlistItemResponseDto[]>;
    create(userId: string, dto: CreateWatchlistItemDto): Promise<WatchlistItemResponseDto>;
    remove(id: string, userId: string): Promise<void>;
}
