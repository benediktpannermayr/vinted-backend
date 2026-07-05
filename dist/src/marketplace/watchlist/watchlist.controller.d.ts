import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { WatchlistService } from './watchlist.service';
export declare class WatchlistController {
    private readonly watchlistService;
    constructor(watchlistService: WatchlistService);
    findAll(user: AuthenticatedUser): Promise<import("./dto/watchlist-item-response.dto").WatchlistItemResponseDto[]>;
    create(user: AuthenticatedUser, dto: CreateWatchlistItemDto): Promise<import("./dto/watchlist-item-response.dto").WatchlistItemResponseDto>;
    remove(id: string, user: AuthenticatedUser): Promise<void>;
}
