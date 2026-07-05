import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ImportPreviewDto } from './dto/import-preview.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { SellItemDto } from './dto/sell-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { RemoveImageDto } from './dto/remove-image.dto';
import { ImportListingPreviewService } from './import-listing-preview.service';
import { ItemsService } from './items.service';
export declare class ItemsController {
    private readonly itemsService;
    private readonly importListingPreviewService;
    constructor(itemsService: ItemsService, importListingPreviewService: ImportListingPreviewService);
    findAll(user: AuthenticatedUser, query: QueryItemsDto): Promise<import("./items.service").PaginatedItems>;
    create(user: AuthenticatedUser, dto: CreateItemDto): Promise<import("./dto/item-response.dto").ItemResponseDto>;
    importPreview(dto: ImportPreviewDto): Promise<import("./dto/import-preview-response.dto").ImportPreviewResponseDto>;
    bulkUpdate(user: AuthenticatedUser, dto: BulkUpdateItemsDto): Promise<{
        updated: number;
    }>;
    findOne(id: string, user: AuthenticatedUser): Promise<import("./dto/item-response.dto").ItemResponseDto>;
    update(id: string, user: AuthenticatedUser, dto: UpdateItemDto): Promise<import("./dto/item-response.dto").ItemResponseDto>;
    remove(id: string, user: AuthenticatedUser): Promise<void>;
    sell(id: string, user: AuthenticatedUser, dto: SellItemDto): Promise<import("./dto/item-response.dto").ItemResponseDto>;
    addImage(id: string, user: AuthenticatedUser, file: Express.Multer.File): Promise<import("./dto/item-response.dto").ItemResponseDto>;
    removeImage(id: string, user: AuthenticatedUser, dto: RemoveImageDto): Promise<import("./dto/item-response.dto").ItemResponseDto>;
}
