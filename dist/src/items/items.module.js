"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsModule = void 0;
const common_1 = require("@nestjs/common");
const storage_provider_interface_1 = require("../common/interfaces/storage-provider.interface");
const local_storage_provider_1 = require("../common/storage/local-storage.provider");
const marketplace_module_1 = require("../marketplace/marketplace.module");
const import_listing_preview_service_1 = require("./import-listing-preview.service");
const items_controller_1 = require("./items.controller");
const items_service_1 = require("./items.service");
const item_repository_interface_1 = require("./repositories/item.repository.interface");
const item_repository_prisma_1 = require("./repositories/item.repository.prisma");
let ItemsModule = class ItemsModule {
};
exports.ItemsModule = ItemsModule;
exports.ItemsModule = ItemsModule = __decorate([
    (0, common_1.Module)({
        imports: [marketplace_module_1.MarketplaceModule],
        controllers: [items_controller_1.ItemsController],
        providers: [
            items_service_1.ItemsService,
            import_listing_preview_service_1.ImportListingPreviewService,
            { provide: item_repository_interface_1.ITEM_REPOSITORY, useClass: item_repository_prisma_1.PrismaItemRepository },
            { provide: storage_provider_interface_1.STORAGE_PROVIDER, useClass: local_storage_provider_1.LocalStorageProvider },
        ],
    })
], ItemsModule);
//# sourceMappingURL=items.module.js.map