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
exports.ImportPreviewResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let ImportPreviewResponseDto = class ImportPreviewResponseDto {
    matchType;
    listingUrl;
    title;
    brand;
    size;
    condition;
    suggestedPurchasePrice;
    images;
    seller;
    constructor(data) {
        this.matchType = data.matchType;
        this.listingUrl = data.listingUrl;
        this.title = data.title ?? null;
        this.brand = data.brand ?? null;
        this.size = data.size ?? null;
        this.condition = data.condition ?? null;
        this.suggestedPurchasePrice = data.suggestedPurchasePrice ?? null;
        this.images = data.images ?? [];
        this.seller = data.seller ?? null;
    }
};
exports.ImportPreviewResponseDto = ImportPreviewResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ enum: ['CACHED', 'LIVE_SEARCH', 'NOT_FOUND'] }),
    __metadata("design:type", String)
], ImportPreviewResponseDto.prototype, "matchType", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], ImportPreviewResponseDto.prototype, "listingUrl", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ImportPreviewResponseDto.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ImportPreviewResponseDto.prototype, "brand", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ImportPreviewResponseDto.prototype, "size", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ImportPreviewResponseDto.prototype, "condition", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ImportPreviewResponseDto.prototype, "suggestedPurchasePrice", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: [String] }),
    __metadata("design:type", Array)
], ImportPreviewResponseDto.prototype, "images", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], ImportPreviewResponseDto.prototype, "seller", void 0);
exports.ImportPreviewResponseDto = ImportPreviewResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], ImportPreviewResponseDto);
//# sourceMappingURL=import-preview-response.dto.js.map