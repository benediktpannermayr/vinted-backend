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
exports.ItemsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const bulk_update_items_dto_1 = require("./dto/bulk-update-items.dto");
const create_item_dto_1 = require("./dto/create-item.dto");
const import_preview_dto_1 = require("./dto/import-preview.dto");
const query_items_dto_1 = require("./dto/query-items.dto");
const sell_item_dto_1 = require("./dto/sell-item.dto");
const update_item_dto_1 = require("./dto/update-item.dto");
const remove_image_dto_1 = require("./dto/remove-image.dto");
const import_listing_preview_service_1 = require("./import-listing-preview.service");
const items_service_1 = require("./items.service");
let ItemsController = class ItemsController {
    itemsService;
    importListingPreviewService;
    constructor(itemsService, importListingPreviewService) {
        this.itemsService = itemsService;
        this.importListingPreviewService = importListingPreviewService;
    }
    findAll(user, query) {
        return this.itemsService.findAll(user.id, query);
    }
    create(user, dto) {
        return this.itemsService.create(user.id, dto);
    }
    importPreview(dto) {
        return this.importListingPreviewService.preview(dto.listingUrl);
    }
    bulkUpdate(user, dto) {
        return this.itemsService.bulkUpdateStatus(user.id, dto);
    }
    findOne(id, user) {
        return this.itemsService.findOne(id, user.id);
    }
    update(id, user, dto) {
        return this.itemsService.update(id, user.id, dto);
    }
    remove(id, user) {
        return this.itemsService.remove(id, user.id);
    }
    sell(id, user, dto) {
        return this.itemsService.sell(id, user.id, dto);
    }
    addImage(id, user, file) {
        return this.itemsService.addImage(id, user.id, file);
    }
    removeImage(id, user, dto) {
        return this.itemsService.removeImage(id, user.id, dto.imageUrl);
    }
};
exports.ItemsController = ItemsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, query_items_dto_1.QueryItemsDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_item_dto_1.CreateItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('import-preview'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [import_preview_dto_1.ImportPreviewDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "importPreview", null);
__decorate([
    (0, common_1.Patch)('bulk-update'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, bulk_update_items_dto_1.BulkUpdateItemsDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "bulkUpdate", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, update_item_dto_1.UpdateItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/sell'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, sell_item_dto_1.SellItemDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "sell", null);
__decorate([
    (0, common_1.Post)(':id/images'),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.UploadedFile)(new common_1.ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ fileIsRequired: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "addImage", null);
__decorate([
    (0, common_1.Delete)(':id/images'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, remove_image_dto_1.RemoveImageDto]),
    __metadata("design:returntype", void 0)
], ItemsController.prototype, "removeImage", null);
exports.ItemsController = ItemsController = __decorate([
    (0, swagger_1.ApiTags)('items'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('items'),
    __metadata("design:paramtypes", [items_service_1.ItemsService,
        import_listing_preview_service_1.ImportListingPreviewService])
], ItemsController);
//# sourceMappingURL=items.controller.js.map