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
exports.WatchlistItemResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const listing_response_dto_1 = require("../../listings/dto/listing-response.dto");
let WatchlistItemResponseDto = class WatchlistItemResponseDto {
    id;
    note;
    createdAt;
    listing;
    constructor(id, note, createdAt, listing) {
        this.id = id;
        this.note = note;
        this.createdAt = createdAt.toISOString();
        this.listing = listing;
    }
};
exports.WatchlistItemResponseDto = WatchlistItemResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WatchlistItemResponseDto.prototype, "id", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Object)
], WatchlistItemResponseDto.prototype, "note", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], WatchlistItemResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ type: listing_response_dto_1.ListingResponseDto }),
    (0, class_transformer_1.Type)(() => listing_response_dto_1.ListingResponseDto),
    __metadata("design:type", listing_response_dto_1.ListingResponseDto)
], WatchlistItemResponseDto.prototype, "listing", void 0);
exports.WatchlistItemResponseDto = WatchlistItemResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [String, Object, Date,
        listing_response_dto_1.ListingResponseDto])
], WatchlistItemResponseDto);
//# sourceMappingURL=watchlist-item-response.dto.js.map