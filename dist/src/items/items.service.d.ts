import { PrismaService } from '../prisma/prisma.service';
import { type IStorageProvider } from '../common/interfaces/storage-provider.interface';
import type { IItemRepository } from './repositories/item.repository.interface';
import type { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import type { CreateItemDto } from './dto/create-item.dto';
import { ItemResponseDto } from './dto/item-response.dto';
import type { QueryItemsDto } from './dto/query-items.dto';
import type { SellItemDto } from './dto/sell-item.dto';
import type { UpdateItemDto } from './dto/update-item.dto';
export interface PaginatedItems {
    items: ItemResponseDto[];
    total: number;
    page: number;
    pageSize: number;
}
export declare class ItemsService {
    private readonly itemRepository;
    private readonly storageProvider;
    private readonly prisma;
    private readonly logger;
    constructor(itemRepository: IItemRepository, storageProvider: IStorageProvider, prisma: PrismaService);
    findAll(userId: string, query: QueryItemsDto): Promise<PaginatedItems>;
    findOne(id: string, userId: string): Promise<ItemResponseDto>;
    create(userId: string, dto: CreateItemDto): Promise<ItemResponseDto>;
    update(id: string, userId: string, dto: UpdateItemDto): Promise<ItemResponseDto>;
    sell(id: string, userId: string, dto: SellItemDto): Promise<ItemResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    bulkUpdateStatus(userId: string, dto: BulkUpdateItemsDto): Promise<{
        updated: number;
    }>;
    addImage(id: string, userId: string, file: Express.Multer.File): Promise<ItemResponseDto>;
    removeImage(id: string, userId: string, imageUrl: string): Promise<ItemResponseDto>;
    private saveImageBuffer;
    private downloadAndStoreImages;
    private deleteImageFile;
    private assertOwnership;
}
