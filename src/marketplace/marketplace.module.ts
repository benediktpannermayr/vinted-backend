import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { ProductsModule } from '../products/products.module';
import { MarketplaceSyncService } from './marketplace-sync.service';
import { MARKETPLACE_PROVIDER } from './providers/marketplace-provider.interface';
import { VintedProvider } from './providers/vinted.provider';
import { SearchProfilesController } from './search-profiles/search-profiles.controller';
import { SearchProfilesService } from './search-profiles/search-profiles.service';
import { SEARCH_PROFILE_REPOSITORY } from './search-profiles/repositories/search-profile.repository.interface';
import { PrismaSearchProfileRepository } from './search-profiles/repositories/search-profile.repository.prisma';
import { ListingsController } from './listings/listings.controller';
import { ListingsService } from './listings/listings.service';
import { LISTING_REPOSITORY } from './listings/repositories/listing.repository.interface';
import { PrismaListingRepository } from './listings/repositories/listing.repository.prisma';
import { ListingScoringService } from './listings/scoring/listing-scoring.service';
import { WatchlistController } from './watchlist/watchlist.controller';
import { WatchlistService } from './watchlist/watchlist.service';

@Module({
  imports: [ScheduleModule.forRoot(), ProductsModule],
  controllers: [
    SearchProfilesController,
    ListingsController,
    WatchlistController,
  ],
  providers: [
    SearchProfilesService,
    ListingsService,
    WatchlistService,
    ListingScoringService,
    MarketplaceSyncService,
    {
      provide: SEARCH_PROFILE_REPOSITORY,
      useClass: PrismaSearchProfileRepository,
    },
    { provide: LISTING_REPOSITORY, useClass: PrismaListingRepository },
    { provide: MARKETPLACE_PROVIDER, useClass: VintedProvider },
  ],
  exports: [MARKETPLACE_PROVIDER, LISTING_REPOSITORY],
})
export class MarketplaceModule {}
