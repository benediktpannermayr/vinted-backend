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
exports.SearchProfilesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const create_search_profile_dto_1 = require("./dto/create-search-profile.dto");
const update_search_profile_dto_1 = require("./dto/update-search-profile.dto");
const search_profiles_service_1 = require("./search-profiles.service");
const marketplace_sync_service_1 = require("../marketplace-sync.service");
let SearchProfilesController = class SearchProfilesController {
    searchProfilesService;
    marketplaceSyncService;
    constructor(searchProfilesService, marketplaceSyncService) {
        this.searchProfilesService = searchProfilesService;
        this.marketplaceSyncService = marketplaceSyncService;
    }
    findAll(user) {
        return this.searchProfilesService.findAll(user.id);
    }
    create(user, dto) {
        return this.searchProfilesService.create(user.id, dto);
    }
    findOne(id, user) {
        return this.searchProfilesService.findOne(id, user.id);
    }
    update(id, user, dto) {
        return this.searchProfilesService.update(id, user.id, dto);
    }
    remove(id, user) {
        return this.searchProfilesService.remove(id, user.id);
    }
    runNow(id, user) {
        return this.marketplaceSyncService.runNow(id, user.id);
    }
};
exports.SearchProfilesController = SearchProfilesController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SearchProfilesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_search_profile_dto_1.CreateSearchProfileDto]),
    __metadata("design:returntype", void 0)
], SearchProfilesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SearchProfilesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_search_profile_dto_1.UpdateSearchProfileDto]),
    __metadata("design:returntype", void 0)
], SearchProfilesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SearchProfilesController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/run'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], SearchProfilesController.prototype, "runNow", null);
exports.SearchProfilesController = SearchProfilesController = __decorate([
    (0, swagger_1.ApiTags)('marketplace'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('marketplace/search-profiles'),
    __metadata("design:paramtypes", [search_profiles_service_1.SearchProfilesService,
        marketplace_sync_service_1.MarketplaceSyncService])
], SearchProfilesController);
//# sourceMappingURL=search-profiles.controller.js.map