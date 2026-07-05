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
exports.ListingResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let ListingResponseDto = class ListingResponseDto {
    id;
    title;
    price;
    brand;
    category;
    size;
    color;
    condition;
    productId;
    productTitle;
    images;
    listingUrl;
    seller;
    publishedAt;
    isFavorite;
    source;
    detectedAt;
    updatedAt;
    score;
    expectedSalePrice;
    expectedProfit;
    expectedMargin;
    averageDaysToSell;
    maxPurchasePrice;
    similarSalesCount;
    recommendation;
    reason;
    isWatchlisted;
    constructor(listing, scoreResult, isWatchlisted) {
        this.id = listing.id;
        this.title = listing.title;
        this.price = Number(listing.price);
        this.brand = listing.brand;
        this.category = listing.category;
        this.size = listing.size;
        this.color = listing.color;
        this.condition = listing.condition;
        this.productId = listing.productId;
        this.productTitle = listing.product?.title ?? null;
        this.images = listing.images;
        this.listingUrl = listing.listingUrl;
        this.seller = listing.seller;
        this.publishedAt = listing.publishedAt
            ? listing.publishedAt.toISOString()
            : null;
        this.isFavorite = listing.isFavorite;
        this.source = listing.source;
        this.detectedAt = listing.detectedAt.toISOString();
        this.updatedAt = listing.updatedAt.toISOString();
        this.score = scoreResult.score;
        this.expectedSalePrice = scoreResult.expectedSalePrice;
        this.expectedProfit = scoreResult.expectedProfit;
        this.expectedMargin = scoreResult.expectedMargin;
        this.averageDaysToSell = scoreResult.averageDaysToSell;
        this.maxPurchasePrice = scoreResult.maxPurchasePrice;
        this.similarSalesCount = scoreResult.similarSalesCount;
        this.recommendation = scoreResult.recommendation;
        this.reason = scoreResult.reason;
        this.isWatchlisted = isWatchlisted;
    }
};
exports.ListingResponseDto = ListingResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "price", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "brand", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "category", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "color", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "condition", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "productTitle", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ListingResponseDto.prototype, "images", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "listingUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "seller", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "publishedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListingResponseDto.prototype, "isFavorite", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "source", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "detectedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "score", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "expectedSalePrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "expectedProfit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "expectedMargin", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ListingResponseDto.prototype, "averageDaysToSell", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "maxPurchasePrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], ListingResponseDto.prototype, "similarSalesCount", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "recommendation", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ListingResponseDto.prototype, "reason", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], ListingResponseDto.prototype, "isWatchlisted", void 0);
exports.ListingResponseDto = ListingResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object, Object, Boolean])
], ListingResponseDto);
//# sourceMappingURL=listing-response.dto.js.map