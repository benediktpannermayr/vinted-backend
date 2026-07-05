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
exports.SearchProfilesService = void 0;
const common_1 = require("@nestjs/common");
const products_service_1 = require("../../products/products.service");
const search_profile_response_dto_1 = require("./dto/search-profile-response.dto");
const search_profile_repository_interface_1 = require("./repositories/search-profile.repository.interface");
let SearchProfilesService = class SearchProfilesService {
    repository;
    productsService;
    constructor(repository, productsService) {
        this.repository = repository;
        this.productsService = productsService;
    }
    async findAll(userId) {
        const profiles = await this.repository.findAllForUser(userId);
        return profiles.map((profile) => new search_profile_response_dto_1.SearchProfileResponseDto(profile));
    }
    async findOne(id, userId) {
        const profile = await this.assertOwnership(id, userId);
        return new search_profile_response_dto_1.SearchProfileResponseDto(profile);
    }
    async create(userId, dto) {
        await this.productsService.assertOwnership(dto.productId, userId);
        const profile = await this.repository.create({
            userId,
            name: dto.name,
            productId: dto.productId,
            sizes: dto.sizes ?? [],
            colors: dto.colors ?? [],
            maxPrice: dto.maxPrice,
            condition: dto.condition,
            isActive: dto.isActive ?? true,
            refreshIntervalMinutes: dto.refreshIntervalMinutes ?? 60,
        });
        return new search_profile_response_dto_1.SearchProfileResponseDto(profile);
    }
    async update(id, userId, dto) {
        await this.assertOwnership(id, userId);
        if (dto.productId) {
            await this.productsService.assertOwnership(dto.productId, userId);
        }
        const profile = await this.repository.update(id, {
            name: dto.name,
            productId: dto.productId,
            sizes: dto.sizes,
            colors: dto.colors,
            maxPrice: dto.maxPrice,
            condition: dto.condition,
            isActive: dto.isActive,
            refreshIntervalMinutes: dto.refreshIntervalMinutes,
        });
        return new search_profile_response_dto_1.SearchProfileResponseDto(profile);
    }
    async remove(id, userId) {
        await this.assertOwnership(id, userId);
        await this.repository.delete(id);
    }
    async assertOwnership(id, userId) {
        const profile = await this.repository.findById(id, userId);
        if (!profile) {
            throw new common_1.NotFoundException('Search profile not found');
        }
        return profile;
    }
};
exports.SearchProfilesService = SearchProfilesService;
exports.SearchProfilesService = SearchProfilesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(search_profile_repository_interface_1.SEARCH_PROFILE_REPOSITORY)),
    __metadata("design:paramtypes", [Object, products_service_1.ProductsService])
], SearchProfilesService);
//# sourceMappingURL=search-profiles.service.js.map