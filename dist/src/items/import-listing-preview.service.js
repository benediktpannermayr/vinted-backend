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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportListingPreviewService = void 0;
const common_1 = require("@nestjs/common");
const vinted_condition_util_1 = require("../common/utils/vinted-condition.util");
const listing_repository_interface_1 = require("../marketplace/listings/repositories/listing.repository.interface");
const marketplace_provider_interface_1 = require("../marketplace/providers/marketplace-provider.interface");
const import_preview_response_dto_1 = require("./dto/import-preview-response.dto");
const LISTING_URL_PATTERN = /\/items\/(\d+)(?:-([a-z0-9-]+))?/i;
let ImportListingPreviewService = class ImportListingPreviewService {
    listingRepository;
    marketplaceProvider;
    constructor(listingRepository, marketplaceProvider) {
        this.listingRepository = listingRepository;
        this.marketplaceProvider = marketplaceProvider;
    }
    async preview(listingUrl) {
        const match = listingUrl.match(LISTING_URL_PATTERN);
        if (!match) {
            throw new common_1.BadRequestException('Keine gültige Vinted-Artikel-URL');
        }
        const [, externalId, slug] = match;
        const cached = await this.listingRepository.findByUrl(listingUrl);
        if (cached) {
            return new import_preview_response_dto_1.ImportPreviewResponseDto({
                matchType: 'CACHED',
                listingUrl,
                title: cached.title,
                brand: cached.brand,
                size: cached.size,
                condition: cached.condition,
                suggestedPurchasePrice: Number(cached.price),
                images: cached.images,
                seller: cached.seller,
            });
        }
        const slugWords = slug ? slug.replace(/-/g, ' ') : '';
        const results = slugWords
            ? await this.marketplaceProvider.searchByText(slugWords)
            : [];
        const liveMatch = results.find((result) => result.externalId === externalId);
        if (liveMatch) {
            await this.listingRepository.upsert(liveMatch.listingUrl, {
                title: liveMatch.title,
                price: liveMatch.price,
                brand: liveMatch.brand,
                category: liveMatch.category,
                size: liveMatch.size,
                color: liveMatch.color,
                condition: (0, vinted_condition_util_1.mapVintedConditionLabel)(liveMatch.condition),
                images: liveMatch.images,
                listingUrl: liveMatch.listingUrl,
                seller: liveMatch.seller,
                publishedAt: liveMatch.publishedAt,
                source: this.marketplaceProvider.source,
                productId: null,
            });
            return new import_preview_response_dto_1.ImportPreviewResponseDto({
                matchType: 'LIVE_SEARCH',
                listingUrl: liveMatch.listingUrl,
                title: liveMatch.title,
                brand: liveMatch.brand,
                size: liveMatch.size,
                condition: (0, vinted_condition_util_1.mapVintedConditionLabel)(liveMatch.condition),
                suggestedPurchasePrice: liveMatch.price,
                images: liveMatch.images,
                seller: liveMatch.seller,
            });
        }
        return new import_preview_response_dto_1.ImportPreviewResponseDto({ matchType: 'NOT_FOUND', listingUrl });
    }
};
exports.ImportListingPreviewService = ImportListingPreviewService;
exports.ImportListingPreviewService = ImportListingPreviewService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(listing_repository_interface_1.LISTING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(marketplace_provider_interface_1.MARKETPLACE_PROVIDER)),
    __metadata("design:paramtypes", [Object, Object])
], ImportListingPreviewService);
//# sourceMappingURL=import-listing-preview.service.js.map