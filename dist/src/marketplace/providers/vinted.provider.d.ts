import { ConfigService } from '@nestjs/config';
import type { MarketplaceSource } from '@prisma/client';
import type { LoggerService } from '@nestjs/common';
import type { IMarketplaceProvider, MarketplaceSearchCriteria, RawMarketplaceListing } from './marketplace-provider.interface';
export declare class VintedProvider implements IMarketplaceProvider {
    private readonly configService;
    readonly source: MarketplaceSource;
    private readonly logger;
    private readonly baseUrl;
    private readonly perPage;
    constructor(configService: ConfigService, logger: LoggerService);
    search(criteria: MarketplaceSearchCriteria): Promise<RawMarketplaceListing[]>;
    searchByText(text: string): Promise<RawMarketplaceListing[]>;
    private fetchAndMap;
    private buildSearchUrl;
    private fetchSessionCookie;
    private mapItem;
}
