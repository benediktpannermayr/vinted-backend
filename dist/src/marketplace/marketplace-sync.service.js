"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MarketplaceSyncService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketplaceSyncService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const vinted_condition_util_1 = require("../common/utils/vinted-condition.util");
const listing_repository_interface_1 = require("./listings/repositories/listing.repository.interface");
const marketplace_provider_interface_1 = require("./providers/marketplace-provider.interface");
const search_profile_repository_interface_1 = require("./search-profiles/repositories/search-profile.repository.interface");
function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
function isDue(profile, now) {
    if (!profile.lastRunAt)
        return true;
    const dueAt = profile.lastRunAt.getTime() + profile.refreshIntervalMinutes * 60_000;
    return now.getTime() >= dueAt;
}
let MarketplaceSyncService = MarketplaceSyncService_1 = class MarketplaceSyncService {
    searchProfileRepository;
    listingRepository;
    vintedProvider;
    configService;
    logger = new common_1.Logger(MarketplaceSyncService_1.name);
    constructor(searchProfileRepository, listingRepository, vintedProvider, configService) {
        this.searchProfileRepository = searchProfileRepository;
        this.listingRepository = listingRepository;
        this.vintedProvider = vintedProvider;
        this.configService = configService;
    }
    async handleCron() {
        if (!this.configService.get('marketplace.syncEnabled')) {
            return;
        }
        const batchSize = this.configService.get('marketplace.syncBatchSize');
        const requestDelayMs = this.configService.get('marketplace.syncRequestDelayMs');
        const activeProfiles = await this.searchProfileRepository.findActive();
        const now = new Date();
        const dueProfiles = activeProfiles
            .filter((profile) => isDue(profile, now))
            .slice(0, batchSize);
        if (dueProfiles.length === 0) {
            return;
        }
        this.logger.log(`Running marketplace sync for ${dueProfiles.length} due search profile(s).`);
        for (const [index, profile] of dueProfiles.entries()) {
            await this.runProfile(profile);
            if (index < dueProfiles.length - 1) {
                await delay(requestDelayMs);
            }
        }
    }
    async runNow(id, userId) {
        const profile = await this.searchProfileRepository.findById(id, userId);
        if (!profile) {
            throw new common_1.NotFoundException('Search profile not found');
        }
        return this.runProfile(profile);
    }
    async runProfile(profile) {
        const rawListings = await this.vintedProvider.search({
            profileName: profile.name,
            productTitle: profile.product.title,
            brand: profile.product.brand,
            category: profile.product.category,
            sizes: profile.sizes,
            colors: profile.colors,
            maxPrice: profile.maxPrice ? Number(profile.maxPrice) : null,
        });
        for (const raw of rawListings) {
            await this.upsertListing(raw, profile.productId);
        }
        await this.searchProfileRepository.markRun(profile.id, new Date());
        this.logger.log(`Search profile "${profile.name}" found ${rawListings.length} listing(s).`);
        return { found: rawListings.length };
    }
    async upsertListing(raw, productId) {
        await this.listingRepository.upsert(raw.listingUrl, {
            title: raw.title,
            price: raw.price,
            brand: raw.brand,
            category: raw.category,
            size: raw.size,
            color: raw.color,
            condition: (0, vinted_condition_util_1.mapVintedConditionLabel)(raw.condition),
            images: raw.images,
            listingUrl: raw.listingUrl,
            seller: raw.seller,
            publishedAt: raw.publishedAt,
            source: this.vintedProvider.source,
            productId,
        });
    }
};
exports.MarketplaceSyncService = MarketplaceSyncService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_5_MINUTES),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MarketplaceSyncService.prototype, "handleCron", null);
exports.MarketplaceSyncService = MarketplaceSyncService = MarketplaceSyncService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(search_profile_repository_interface_1.SEARCH_PROFILE_REPOSITORY)),
    __param(1, (0, common_1.Inject)(listing_repository_interface_1.LISTING_REPOSITORY)),
    __param(2, (0, common_1.Inject)(marketplace_provider_interface_1.MARKETPLACE_PROVIDER)),
    __metadata("design:paramtypes", [Object, Object, Object, config_1.ConfigService])
], MarketplaceSyncService);
//# sourceMappingURL=marketplace-sync.service.js.map