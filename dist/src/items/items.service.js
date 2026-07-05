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
var ItemsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const storage_provider_interface_1 = require("../common/interfaces/storage-provider.interface");
const item_repository_interface_1 = require("./repositories/item.repository.interface");
const item_response_dto_1 = require("./dto/item-response.dto");
let ItemsService = ItemsService_1 = class ItemsService {
    itemRepository;
    storageProvider;
    prisma;
    logger = new common_1.Logger(ItemsService_1.name);
    constructor(itemRepository, storageProvider, prisma) {
        this.itemRepository = itemRepository;
        this.storageProvider = storageProvider;
        this.prisma = prisma;
    }
    async findAll(userId, query) {
        const filters = {
            userId,
            search: query.search,
            status: query.status,
            brand: query.brand,
            category: query.category,
            size: query.size,
            condition: query.condition,
        };
        const [items, total] = await Promise.all([
            this.itemRepository.findMany({
                ...filters,
                sortBy: query.sortBy,
                sortOrder: query.sortOrder,
                skip: (query.page - 1) * query.pageSize,
                take: query.pageSize,
            }),
            this.itemRepository.count(filters),
        ]);
        return {
            items: items.map((item) => new item_response_dto_1.ItemResponseDto(item)),
            total,
            page: query.page,
            pageSize: query.pageSize,
        };
    }
    async findOne(id, userId) {
        const item = await this.itemRepository.findById(id, userId);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return new item_response_dto_1.ItemResponseDto(item);
    }
    async create(userId, dto) {
        const created = await this.prisma.$transaction(async (tx) => {
            const item = await tx.item.create({
                data: {
                    userId,
                    title: dto.title,
                    brand: dto.brand,
                    category: dto.category,
                    size: dto.size,
                    condition: dto.condition,
                    color: dto.color,
                    description: dto.description,
                    notes: dto.notes,
                    purchasePrice: dto.purchasePrice,
                    purchaseShipping: dto.purchaseShipping,
                    purchaseFees: dto.purchaseFees,
                    expectedSalePrice: dto.expectedSalePrice,
                    purchaseDate: new Date(dto.purchaseDate),
                    sourceListingUrl: dto.sourceListingUrl,
                },
            });
            await tx.purchase.create({
                data: {
                    userId,
                    itemId: item.id,
                    price: dto.purchasePrice,
                    shippingCost: dto.purchaseShipping,
                    fees: dto.purchaseFees,
                    purchaseDate: new Date(dto.purchaseDate),
                },
            });
            return item;
        });
        if (!dto.importImageUrls?.length) {
            return new item_response_dto_1.ItemResponseDto(created);
        }
        const importedImageUrls = await this.downloadAndStoreImages(created.id, dto.importImageUrls);
        const item = await this.itemRepository.update(created.id, {
            images: importedImageUrls,
        });
        return new item_response_dto_1.ItemResponseDto(item);
    }
    async update(id, userId, dto) {
        await this.assertOwnership(id, userId);
        const item = await this.itemRepository.update(id, {
            title: dto.title,
            brand: dto.brand,
            category: dto.category,
            size: dto.size,
            condition: dto.condition,
            color: dto.color,
            description: dto.description,
            notes: dto.notes,
            purchasePrice: dto.purchasePrice,
            purchaseShipping: dto.purchaseShipping,
            purchaseFees: dto.purchaseFees,
            expectedSalePrice: dto.expectedSalePrice,
            purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
            status: dto.status,
        });
        return new item_response_dto_1.ItemResponseDto(item);
    }
    async sell(id, userId, dto) {
        await this.assertOwnership(id, userId);
        const item = await this.prisma.$transaction(async (tx) => {
            const updated = await tx.item.update({
                where: { id },
                data: {
                    status: 'SOLD',
                    soldPrice: dto.soldPrice,
                    saleShipping: dto.saleShipping,
                    saleFees: dto.saleFees,
                    soldDate: new Date(dto.soldDate),
                },
            });
            await tx.sale.create({
                data: {
                    userId,
                    itemId: id,
                    salePrice: dto.soldPrice,
                    shippingCost: dto.saleShipping,
                    fees: dto.saleFees,
                    saleDate: new Date(dto.soldDate),
                    platform: dto.platform,
                    buyer: dto.buyer,
                    notes: dto.notes,
                },
            });
            return updated;
        });
        return new item_response_dto_1.ItemResponseDto(item);
    }
    async remove(id, userId) {
        const existing = await this.assertOwnership(id, userId);
        await Promise.all(existing.images.map((imageUrl) => this.deleteImageFile(imageUrl)));
        await this.itemRepository.delete(id);
    }
    async bulkUpdateStatus(userId, dto) {
        const updated = await this.itemRepository.updateManyStatus(dto.ids, userId, dto.status);
        return { updated };
    }
    async addImage(id, userId, file) {
        const existing = await this.assertOwnership(id, userId);
        const extension = file.originalname.split('.').pop() ?? 'jpg';
        const imageUrl = await this.saveImageBuffer(id, file.buffer, extension);
        const item = await this.itemRepository.update(id, {
            images: [...existing.images, imageUrl],
        });
        return new item_response_dto_1.ItemResponseDto(item);
    }
    async removeImage(id, userId, imageUrl) {
        const existing = await this.assertOwnership(id, userId);
        if (!existing.images.includes(imageUrl)) {
            throw new common_1.BadRequestException('Image does not belong to this item');
        }
        const item = await this.itemRepository.update(id, {
            images: existing.images.filter((img) => img !== imageUrl),
        });
        await this.deleteImageFile(imageUrl);
        return new item_response_dto_1.ItemResponseDto(item);
    }
    async saveImageBuffer(itemId, buffer, extension) {
        const filename = `${itemId}-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;
        const path = await this.storageProvider.save(buffer, filename);
        return this.storageProvider.getUrl(path);
    }
    async downloadAndStoreImages(itemId, urls) {
        const savedUrls = [];
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const buffer = Buffer.from(await response.arrayBuffer());
                const extension = url.split('.').pop()?.split('?')[0]?.slice(0, 4) || 'jpg';
                savedUrls.push(await this.saveImageBuffer(itemId, buffer, extension));
            }
            catch (error) {
                this.logger.warn(`Failed to import image ${url}: ${error instanceof Error ? error.message : String(error)}`, ItemsService_1.name);
            }
        }
        return savedUrls;
    }
    async deleteImageFile(imageUrl) {
        try {
            await this.storageProvider.delete(imageUrl.replace(/^\/uploads\//, ''));
        }
        catch {
        }
    }
    async assertOwnership(id, userId) {
        const item = await this.itemRepository.findById(id, userId);
        if (!item) {
            throw new common_1.NotFoundException('Item not found');
        }
        return item;
    }
};
exports.ItemsService = ItemsService;
exports.ItemsService = ItemsService = ItemsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(item_repository_interface_1.ITEM_REPOSITORY)),
    __param(1, (0, common_1.Inject)(storage_provider_interface_1.STORAGE_PROVIDER)),
    __metadata("design:paramtypes", [Object, Object, prisma_service_1.PrismaService])
], ItemsService);
//# sourceMappingURL=items.service.js.map