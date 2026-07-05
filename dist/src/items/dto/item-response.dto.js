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
exports.ItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
function toNumber(value) {
    if (value === null || value === undefined)
        return null;
    return Number(value);
}
function toDateOnly(value) {
    return value ? value.toISOString() : null;
}
class ItemProductDto {
    id;
    title;
    brand;
    category;
}
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemProductDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemProductDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemProductDto.prototype, "brand", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemProductDto.prototype, "category", void 0);
let ItemResponseDto = class ItemResponseDto {
    id;
    productId;
    product;
    size;
    condition;
    color;
    description;
    notes;
    purchasePrice;
    purchaseShipping;
    purchaseFees;
    expectedSalePrice;
    soldPrice;
    saleShipping;
    saleFees;
    purchaseDate;
    soldDate;
    status;
    images;
    sourceListingUrl;
    createdAt;
    updatedAt;
    profit;
    margin;
    daysInStock;
    constructor(item) {
        this.id = item.id;
        this.productId = item.productId;
        this.product = {
            id: item.product.id,
            title: item.product.title,
            brand: item.product.brand,
            category: item.product.category,
        };
        this.size = item.size;
        this.condition = item.condition;
        this.color = item.color;
        this.description = item.description;
        this.notes = item.notes;
        this.purchasePrice = toNumber(item.purchasePrice);
        this.purchaseShipping = toNumber(item.purchaseShipping);
        this.purchaseFees = toNumber(item.purchaseFees);
        this.expectedSalePrice = toNumber(item.expectedSalePrice);
        this.soldPrice = toNumber(item.soldPrice);
        this.saleShipping = toNumber(item.saleShipping);
        this.saleFees = toNumber(item.saleFees);
        this.purchaseDate = toDateOnly(item.purchaseDate);
        this.soldDate = toDateOnly(item.soldDate);
        this.status = item.status;
        this.images = item.images;
        this.sourceListingUrl = item.sourceListingUrl;
        this.createdAt = item.createdAt.toISOString();
        this.updatedAt = item.updatedAt.toISOString();
        const totalCost = (this.purchasePrice ?? 0) +
            (this.purchaseShipping ?? 0) +
            (this.purchaseFees ?? 0);
        if (this.soldPrice !== null) {
            const netSale = this.soldPrice - (this.saleShipping ?? 0) - (this.saleFees ?? 0);
            this.profit = netSale - totalCost;
            this.margin =
                this.soldPrice > 0 ? (this.profit / this.soldPrice) * 100 : null;
        }
        else {
            this.profit = null;
            this.margin = null;
        }
        const end = item.soldDate ?? new Date();
        const start = item.purchaseDate ?? item.createdAt;
        this.daysInStock = Math.max(0, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
    }
};
exports.ItemResponseDto = ItemResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "productId", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: ItemProductDto }),
    __metadata("design:type", ItemProductDto)
], ItemResponseDto.prototype, "product", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "condition", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "color", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "description", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "notes", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "purchasePrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "purchaseShipping", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "purchaseFees", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "expectedSalePrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "soldPrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "saleShipping", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "saleFees", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "purchaseDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "soldDate", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "status", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ItemResponseDto.prototype, "images", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "sourceListingUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ItemResponseDto.prototype, "updatedAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Gewinn in EUR, nur bei verkauften Artikeln',
    }),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "profit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Marge in %, nur bei verkauften Artikeln',
    }),
    __metadata("design:type", Object)
], ItemResponseDto.prototype, "margin", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Tage im Lager (bis heute oder bis Verkaufsdatum)',
    }),
    __metadata("design:type", Number)
], ItemResponseDto.prototype, "daysInStock", void 0);
exports.ItemResponseDto = ItemResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ItemResponseDto);
//# sourceMappingURL=item-response.dto.js.map