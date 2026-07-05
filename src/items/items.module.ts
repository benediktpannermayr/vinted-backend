import { Module } from '@nestjs/common';
import { STORAGE_PROVIDER } from '../common/interfaces/storage-provider.interface';
import { LocalStorageProvider } from '../common/storage/local-storage.provider';
import { MarketplaceModule } from '../marketplace/marketplace.module';
import { ProductsModule } from '../products/products.module';
import { ImportListingPreviewService } from './import-listing-preview.service';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ITEM_REPOSITORY } from './repositories/item.repository.interface';
import { PrismaItemRepository } from './repositories/item.repository.prisma';

@Module({
  imports: [MarketplaceModule, ProductsModule],
  controllers: [ItemsController],
  providers: [
    ItemsService,
    ImportListingPreviewService,
    { provide: ITEM_REPOSITORY, useClass: PrismaItemRepository },
    { provide: STORAGE_PROVIDER, useClass: LocalStorageProvider },
  ],
  exports: [ITEM_REPOSITORY],
})
export class ItemsModule {}
