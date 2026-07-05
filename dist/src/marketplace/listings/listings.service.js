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
exports.ListingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const listing_response_dto_1 = require("./dto/listing-response.dto");
const listing_repository_interface_1 = require("./repositories/listing.repository.interface");
const listing_scoring_service_1 = require("./scoring/listing-scoring.service");
const SIMILAR_SALES_LOOKBACK = 200;
let ListingsService = class ListingsService {
    listingRepository;
    scoringService;
    prisma;
    constructor(listingRepository, scoringService, prisma) {
        this.listingRepository = listingRepository;
        this.scoringService = scoringService;
        this.prisma = prisma;
    }
    async findAll(userId, query) {
        const filters = {
            search: query.search,
            brand: query.brand,
            category: query.category,
            size: query.size,
            color: query.color,
            productId: query.productId,
            condition: query.condition,
            maxPrice: query.maxPrice,
            source: query.source,
            isFavorite: query.isFavorite,
        };
        const [listings, total, soldItems, watchlistedIds] = await Promise.all([
            this.listingRepository.findMany({
                ...filters,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                skip: (query.page - 1) * query.pageSize,
                take: query.pageSize,
            }),
            this.listingRepository.count(filters),
            this.findRecentSoldItems(userId),
            this.findWatchlistedIds(userId),
        ]);
        const items = listings.map((listing) => {
            const similarSales = this.findSimilarSales(soldItems, listing.brand, listing.category);
            const scoreResult = this.scoringService.score({
                price: Number(listing.price),
                similarSales,
            });
            return new listing_response_dto_1.ListingResponseDto(listing, scoreResult, watchlistedIds.has(listing.id));
        });
        return { items, total, page: query.page, pageSize: query.pageSize };
    }
    async findOne(id, userId) {
        const listing = await this.listingRepository.findById(id);
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const [soldItems, watchlistedIds] = await Promise.all([
            this.findRecentSoldItems(userId),
            this.findWatchlistedIds(userId),
        ]);
        const similarSales = this.findSimilarSales(soldItems, listing.brand, listing.category);
        const scoreResult = this.scoringService.score({
            price: Number(listing.price),
            similarSales,
        });
        return new listing_response_dto_1.ListingResponseDto(listing, scoreResult, watchlistedIds.has(id));
    }
    async findRecentSoldItems(userId) {
        return this.prisma.item.findMany({
            where: { userId, status: 'SOLD', soldDate: { not: null } },
            select: {
                brand: true,
                category: true,
                soldPrice: true,
                purchasePrice: true,
                purchaseDate: true,
                soldDate: true,
            },
            orderBy: { soldDate: 'desc' },
            take: SIMILAR_SALES_LOOKBACK,
        });
    }
    async findWatchlistedIds(userId) {
        const entries = await this.prisma.watchlist.findMany({
            where: { userId },
            select: { marketplaceListingId: true },
        });
        return new Set(entries.map((entry) => entry.marketplaceListingId));
    }
    findSimilarSales(soldItems, brand, category) {
        return soldItems
            .filter((item) => (brand && item.brand === brand) ||
            (category && item.category === category))
            .filter((item) => item.soldPrice !== null &&
            item.purchasePrice !== null &&
            item.soldDate)
            .map((item) => ({
            soldPrice: Number(item.soldPrice),
            purchasePrice: Number(item.purchasePrice),
            daysToSell: Math.max(0, Math.round((item.soldDate.getTime() -
                (item.purchaseDate ?? item.soldDate).getTime()) /
                (1000 * 60 * 60 * 24))),
        }));
    }
};
exports.ListingsService = ListingsService;
exports.ListingsService = ListingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(listing_repository_interface_1.LISTING_REPOSITORY)),
    __metadata("design:paramtypes", [Object, listing_scoring_service_1.ListingScoringService,
        prisma_service_1.PrismaService])
], ListingsService);
//# sourceMappingURL=listings.service.js.map