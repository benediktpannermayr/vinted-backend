"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceModule = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const products_module_1 = require("../products/products.module");
const marketplace_sync_service_1 = require("./marketplace-sync.service");
const marketplace_provider_interface_1 = require("./providers/marketplace-provider.interface");
const vinted_provider_1 = require("./providers/vinted.provider");
const search_profiles_controller_1 = require("./search-profiles/search-profiles.controller");
const search_profiles_service_1 = require("./search-profiles/search-profiles.service");
const search_profile_repository_interface_1 = require("./search-profiles/repositories/search-profile.repository.interface");
const search_profile_repository_prisma_1 = require("./search-profiles/repositories/search-profile.repository.prisma");
const listings_controller_1 = require("./listings/listings.controller");
const listings_service_1 = require("./listings/listings.service");
const listing_repository_interface_1 = require("./listings/repositories/listing.repository.interface");
const listing_repository_prisma_1 = require("./listings/repositories/listing.repository.prisma");
const listing_scoring_service_1 = require("./listings/scoring/listing-scoring.service");
const watchlist_controller_1 = require("./watchlist/watchlist.controller");
const watchlist_service_1 = require("./watchlist/watchlist.service");
let MarketplaceModule = class MarketplaceModule {
};
exports.MarketplaceModule = MarketplaceModule;
exports.MarketplaceModule = MarketplaceModule = __decorate([
    (0, common_1.Module)({
        imports: [schedule_1.ScheduleModule.forRoot(), products_module_1.ProductsModule],
        controllers: [
            search_profiles_controller_1.SearchProfilesController,
            listings_controller_1.ListingsController,
            watchlist_controller_1.WatchlistController,
        ],
        providers: [
            search_profiles_service_1.SearchProfilesService,
            listings_service_1.ListingsService,
            watchlist_service_1.WatchlistService,
            listing_scoring_service_1.ListingScoringService,
            marketplace_sync_service_1.MarketplaceSyncService,
            {
                provide: search_profile_repository_interface_1.SEARCH_PROFILE_REPOSITORY,
                useClass: search_profile_repository_prisma_1.PrismaSearchProfileRepository,
            },
            { provide: listing_repository_interface_1.LISTING_REPOSITORY, useClass: listing_repository_prisma_1.PrismaListingRepository },
            { provide: marketplace_provider_interface_1.MARKETPLACE_PROVIDER, useClass: vinted_provider_1.VintedProvider },
        ],
        exports: [marketplace_provider_interface_1.MARKETPLACE_PROVIDER, listing_repository_interface_1.LISTING_REPOSITORY],
    })
], MarketplaceModule);
//# sourceMappingURL=marketplace.module.js.map