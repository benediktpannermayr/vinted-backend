import { ConfigService } from '@nestjs/config';
import { type IListingRepository } from './listings/repositories/listing.repository.interface';
import type { IMarketplaceProvider } from './providers/marketplace-provider.interface';
import { type ISearchProfileRepository } from './search-profiles/repositories/search-profile.repository.interface';
export declare class MarketplaceSyncService {
    private readonly searchProfileRepository;
    private readonly listingRepository;
    private readonly vintedProvider;
    private readonly configService;
    private readonly logger;
    constructor(searchProfileRepository: ISearchProfileRepository, listingRepository: IListingRepository, vintedProvider: IMarketplaceProvider, configService: ConfigService);
    handleCron(): Promise<void>;
    runNow(id: string, userId: string): Promise<{
        found: number;
    }>;
    private runProfile;
    private upsertListing;
}
