import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CreateSearchProfileDto } from './dto/create-search-profile.dto';
import { UpdateSearchProfileDto } from './dto/update-search-profile.dto';
import { SearchProfilesService } from './search-profiles.service';
import { MarketplaceSyncService } from '../marketplace-sync.service';
export declare class SearchProfilesController {
    private readonly searchProfilesService;
    private readonly marketplaceSyncService;
    constructor(searchProfilesService: SearchProfilesService, marketplaceSyncService: MarketplaceSyncService);
    findAll(user: AuthenticatedUser): Promise<import("./dto/search-profile-response.dto").SearchProfileResponseDto[]>;
    create(user: AuthenticatedUser, dto: CreateSearchProfileDto): Promise<import("./dto/search-profile-response.dto").SearchProfileResponseDto>;
    findOne(id: string, user: AuthenticatedUser): Promise<import("./dto/search-profile-response.dto").SearchProfileResponseDto>;
    update(id: string, user: AuthenticatedUser, dto: UpdateSearchProfileDto): Promise<import("./dto/search-profile-response.dto").SearchProfileResponseDto>;
    remove(id: string, user: AuthenticatedUser): Promise<void>;
    runNow(id: string, user: AuthenticatedUser): Promise<{
        found: number;
    }>;
}
