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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchlistService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const listings_service_1 = require("../listings/listings.service");
const watchlist_item_response_dto_1 = require("./dto/watchlist-item-response.dto");
let WatchlistService = class WatchlistService {
    prisma;
    listingsService;
    constructor(prisma, listingsService) {
        this.prisma = prisma;
        this.listingsService = listingsService;
    }
    async findAll(userId) {
        const entries = await this.prisma.watchlist.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return Promise.all(entries.map(async (entry) => {
            const listing = await this.listingsService.findOne(entry.marketplaceListingId, userId);
            return new watchlist_item_response_dto_1.WatchlistItemResponseDto(entry.id, entry.note, entry.createdAt, listing);
        }));
    }
    async create(userId, dto) {
        const listing = await this.prisma.marketplaceListing.findUnique({
            where: { id: dto.marketplaceListingId },
        });
        if (!listing) {
            throw new common_1.NotFoundException('Listing not found');
        }
        const existing = await this.prisma.watchlist.findUnique({
            where: {
                userId_marketplaceListingId: {
                    userId,
                    marketplaceListingId: dto.marketplaceListingId,
                },
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Listing is already on the watchlist');
        }
        const entry = await this.prisma.watchlist.create({
            data: {
                userId,
                marketplaceListingId: dto.marketplaceListingId,
                note: dto.note,
            },
        });
        const listingDto = await this.listingsService.findOne(dto.marketplaceListingId, userId);
        return new watchlist_item_response_dto_1.WatchlistItemResponseDto(entry.id, entry.note, entry.createdAt, listingDto);
    }
    async remove(id, userId) {
        const entry = await this.prisma.watchlist.findFirst({
            where: { id, userId },
        });
        if (!entry) {
            throw new common_1.NotFoundException('Watchlist entry not found');
        }
        await this.prisma.watchlist.delete({ where: { id } });
    }
};
exports.WatchlistService = WatchlistService;
exports.WatchlistService = WatchlistService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        listings_service_1.ListingsService])
], WatchlistService);
//# sourceMappingURL=watchlist.service.js.map