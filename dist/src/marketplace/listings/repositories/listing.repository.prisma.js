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
exports.PrismaListingRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../../prisma/prisma.service");
const WITH_PRODUCT = {
    include: { product: { select: { id: true, title: true } } },
};
let PrismaListingRepository = class PrismaListingRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildWhere(filters) {
        return {
            title: filters.search
                ? { contains: filters.search, mode: 'insensitive' }
                : undefined,
            brand: filters.brand
                ? { equals: filters.brand, mode: 'insensitive' }
                : undefined,
            category: filters.category
                ? { equals: filters.category, mode: 'insensitive' }
                : undefined,
            size: filters.size
                ? { equals: filters.size, mode: 'insensitive' }
                : undefined,
            color: filters.color
                ? { equals: filters.color, mode: 'insensitive' }
                : undefined,
            condition: filters.condition,
            price: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
            source: filters.source,
            isFavorite: filters.isFavorite,
            productId: filters.productId,
        };
    }
    findMany(options) {
        return this.prisma.marketplaceListing.findMany({
            where: this.buildWhere(options),
            orderBy: { [options.sortBy]: options.sortOrder },
            skip: options.skip,
            take: options.take,
            ...WITH_PRODUCT,
        });
    }
    count(filters) {
        return this.prisma.marketplaceListing.count({
            where: this.buildWhere(filters),
        });
    }
    findById(id) {
        return this.prisma.marketplaceListing.findUnique({
            where: { id },
            ...WITH_PRODUCT,
        });
    }
    findByUrl(listingUrl) {
        return this.prisma.marketplaceListing.findUnique({
            where: { listingUrl },
            ...WITH_PRODUCT,
        });
    }
    async upsert(listingUrl, data) {
        const existing = await this.prisma.marketplaceListing.findUnique({
            where: { listingUrl },
        });
        if (!existing) {
            return this.prisma.marketplaceListing.create({ data, ...WITH_PRODUCT });
        }
        return this.prisma.marketplaceListing.update({
            where: { listingUrl },
            data: {
                title: data.title,
                price: data.price,
                brand: data.brand,
                category: data.category,
                size: data.size,
                color: data.color,
                condition: data.condition,
                images: data.images,
                seller: data.seller,
                publishedAt: data.publishedAt,
                productId: existing.productId ?? data.productId,
            },
            ...WITH_PRODUCT,
        });
    }
};
exports.PrismaListingRepository = PrismaListingRepository;
exports.PrismaListingRepository = PrismaListingRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaListingRepository);
//# sourceMappingURL=listing.repository.prisma.js.map