import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  STORAGE_PROVIDER,
  type IStorageProvider,
} from '../common/interfaces/storage-provider.interface';
import { ITEM_REPOSITORY } from './repositories/item.repository.interface';
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

@Injectable()
export class ItemsService {
  private readonly logger = new Logger(ItemsService.name);

  constructor(
    @Inject(ITEM_REPOSITORY) private readonly itemRepository: IItemRepository,
    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: IStorageProvider,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(userId: string, query: QueryItemsDto): Promise<PaginatedItems> {
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
      items: items.map((item) => new ItemResponseDto(item)),
      total,
      page: query.page,
      pageSize: query.pageSize,
    };
  }

  async findOne(id: string, userId: string): Promise<ItemResponseDto> {
    const item = await this.itemRepository.findById(id, userId);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return new ItemResponseDto(item);
  }

  async create(userId: string, dto: CreateItemDto): Promise<ItemResponseDto> {
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
      return new ItemResponseDto(created);
    }

    const importedImageUrls = await this.downloadAndStoreImages(
      created.id,
      dto.importImageUrls,
    );
    const item = await this.itemRepository.update(created.id, {
      images: importedImageUrls,
    });
    return new ItemResponseDto(item);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateItemDto,
  ): Promise<ItemResponseDto> {
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

    return new ItemResponseDto(item);
  }

  async sell(
    id: string,
    userId: string,
    dto: SellItemDto,
  ): Promise<ItemResponseDto> {
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

    return new ItemResponseDto(item);
  }

  async remove(id: string, userId: string): Promise<void> {
    const existing = await this.assertOwnership(id, userId);
    await Promise.all(
      existing.images.map((imageUrl) => this.deleteImageFile(imageUrl)),
    );
    await this.itemRepository.delete(id);
  }

  async bulkUpdateStatus(
    userId: string,
    dto: BulkUpdateItemsDto,
  ): Promise<{ updated: number }> {
    const updated = await this.itemRepository.updateManyStatus(
      dto.ids,
      userId,
      dto.status,
    );
    return { updated };
  }

  async addImage(
    id: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<ItemResponseDto> {
    const existing = await this.assertOwnership(id, userId);

    const extension = file.originalname.split('.').pop() ?? 'jpg';
    const imageUrl = await this.saveImageBuffer(id, file.buffer, extension);

    const item = await this.itemRepository.update(id, {
      images: [...existing.images, imageUrl],
    });

    return new ItemResponseDto(item);
  }

  async removeImage(
    id: string,
    userId: string,
    imageUrl: string,
  ): Promise<ItemResponseDto> {
    const existing = await this.assertOwnership(id, userId);

    if (!existing.images.includes(imageUrl)) {
      throw new BadRequestException('Image does not belong to this item');
    }

    const item = await this.itemRepository.update(id, {
      images: existing.images.filter((img) => img !== imageUrl),
    });
    await this.deleteImageFile(imageUrl);

    return new ItemResponseDto(item);
  }

  private async saveImageBuffer(
    itemId: string,
    buffer: Buffer,
    extension: string,
  ): Promise<string> {
    const filename = `${itemId}-${Date.now()}-${Math.round(Math.random() * 1e6)}.${extension}`;
    const path = await this.storageProvider.save(buffer, filename);
    return this.storageProvider.getUrl(path);
  }

  /** Best-effort: one failed download is logged and skipped, never aborts the whole import. */
  private async downloadAndStoreImages(
    itemId: string,
    urls: string[],
  ): Promise<string[]> {
    const savedUrls: string[] = [];

    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const buffer = Buffer.from(await response.arrayBuffer());
        const extension =
          url.split('.').pop()?.split('?')[0]?.slice(0, 4) || 'jpg';
        savedUrls.push(await this.saveImageBuffer(itemId, buffer, extension));
      } catch (error) {
        this.logger.warn(
          `Failed to import image ${url}: ${error instanceof Error ? error.message : String(error)}`,
          ItemsService.name,
        );
      }
    }

    return savedUrls;
  }

  private async deleteImageFile(imageUrl: string): Promise<void> {
    try {
      await this.storageProvider.delete(imageUrl.replace(/^\/uploads\//, ''));
    } catch {
      // File may already be gone — deletion is best-effort cleanup, not critical.
    }
  }

  private async assertOwnership(id: string, userId: string) {
    const item = await this.itemRepository.findById(id, userId);
    if (!item) {
      throw new NotFoundException('Item not found');
    }
    return item;
  }
}
