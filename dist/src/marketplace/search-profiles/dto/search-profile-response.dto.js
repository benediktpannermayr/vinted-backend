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
exports.SearchProfileResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
class SearchProfileProductDto {
    id;
    title;
    brand;
    category;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileProductDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileProductDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SearchProfileProductDto.prototype, "brand", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SearchProfileProductDto.prototype, "category", void 0);
let SearchProfileResponseDto = class SearchProfileResponseDto {
    id;
    name;
    productId;
    product;
    sizes;
    colors;
    maxPrice;
    condition;
    isActive;
    refreshIntervalMinutes;
    lastRunAt;
    createdAt;
    updatedAt;
    constructor(profile) {
        this.id = profile.id;
        this.name = profile.name;
        this.productId = profile.productId;
        this.product = {
            id: profile.product.id,
            title: profile.product.title,
            brand: profile.product.brand,
            category: profile.product.category,
        };
        this.sizes = profile.sizes;
        this.colors = profile.colors;
        this.maxPrice = profile.maxPrice === null ? null : Number(profile.maxPrice);
        this.condition = profile.condition;
        this.isActive = profile.isActive;
        this.refreshIntervalMinutes = profile.refreshIntervalMinutes;
        this.lastRunAt = profile.lastRunAt ? profile.lastRunAt.toISOString() : null;
        this.createdAt = profile.createdAt.toISOString();
        this.updatedAt = profile.updatedAt.toISOString();
    }
};
exports.SearchProfileResponseDto = SearchProfileResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileResponseDto.prototype, "name", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileResponseDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: SearchProfileProductDto }),
    __metadata("design:type", SearchProfileProductDto)
], SearchProfileResponseDto.prototype, "product", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], SearchProfileResponseDto.prototype, "sizes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], SearchProfileResponseDto.prototype, "colors", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SearchProfileResponseDto.prototype, "maxPrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SearchProfileResponseDto.prototype, "condition", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Boolean)
], SearchProfileResponseDto.prototype, "isActive", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], SearchProfileResponseDto.prototype, "refreshIntervalMinutes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], SearchProfileResponseDto.prototype, "lastRunAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SearchProfileResponseDto.prototype, "updatedAt", void 0);
exports.SearchProfileResponseDto = SearchProfileResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], SearchProfileResponseDto);
//# sourceMappingURL=search-profile-response.dto.js.map