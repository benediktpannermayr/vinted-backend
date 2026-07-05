import { NotFoundException } from '@nestjs/common';
import type { Item } from '@prisma/client';
import { ItemsService } from './items.service';

function buildItem(overrides: Partial<Item> = {}): Item {
  return {
    id: 'item-1',
    title: 'Ralph Lauren Oxford Hemd',
    brand: 'Ralph Lauren',
    category: 'Hemden',
    size: 'M',
    condition: 'VERY_GOOD',
    color: null,
    description: null,
    notes: null,
    purchasePrice: 8.5 as never,
    purchaseShipping: null,
    purchaseFees: null,
    expectedSalePrice: null,
    soldPrice: null,
    saleShipping: null,
    saleFees: null,
    purchaseDate: new Date('2026-06-01'),
    soldDate: null,
    status: 'IN_STOCK',
    images: [],
    sourceListingUrl: null,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    userId: 'user-1',
    ...overrides,
  };
}

describe('ItemsService', () => {
  let service: ItemsService;
  let itemRepository: {
    findMany: jest.Mock;
    count: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
    updateManyStatus: jest.Mock;
  };
  let storageProvider: {
    save: jest.Mock;
    delete: jest.Mock;
    getUrl: jest.Mock;
  };
  let prisma: { $transaction: jest.Mock };
  let txItemCreate: jest.Mock<
    Promise<Item>,
    [{ data: Record<string, unknown> }]
  >;
  let txPurchaseCreate: jest.Mock<
    Promise<unknown>,
    [{ data: Record<string, unknown> }]
  >;
  let txItemUpdate: jest.Mock<
    Promise<Item>,
    [{ data: Record<string, unknown> }]
  >;
  let txSaleCreate: jest.Mock<
    Promise<unknown>,
    [{ data: Record<string, unknown> }]
  >;

  beforeEach(() => {
    itemRepository = {
      findMany: jest.fn(),
      count: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      updateManyStatus: jest.fn(),
    };
    storageProvider = { save: jest.fn(), delete: jest.fn(), getUrl: jest.fn() };

    txItemCreate = jest.fn<
      Promise<Item>,
      [{ data: Record<string, unknown> }]
    >();
    txPurchaseCreate = jest.fn<
      Promise<unknown>,
      [{ data: Record<string, unknown> }]
    >();
    txItemUpdate = jest.fn<
      Promise<Item>,
      [{ data: Record<string, unknown> }]
    >();
    txSaleCreate = jest.fn<
      Promise<unknown>,
      [{ data: Record<string, unknown> }]
    >();

    prisma = {
      $transaction: jest.fn((callback: (tx: unknown) => unknown) =>
        callback({
          item: { create: txItemCreate, update: txItemUpdate },
          purchase: { create: txPurchaseCreate },
          sale: { create: txSaleCreate },
        }),
      ),
    };

    service = new ItemsService(
      itemRepository,
      storageProvider,
      prisma as never,
    );
  });

  describe('create', () => {
    it('creates the item and a linked purchase record in the same transaction', async () => {
      const created = buildItem();
      txItemCreate.mockResolvedValue(created);
      txPurchaseCreate.mockResolvedValue({});

      const result = await service.create('user-1', {
        title: 'Ralph Lauren Oxford Hemd',
        purchasePrice: 8.5,
        purchaseDate: '2026-06-01',
      });

      const itemCreateArg = txItemCreate.mock.calls[0][0];
      expect(itemCreateArg.data).toMatchObject({
        userId: 'user-1',
        purchasePrice: 8.5,
      });

      const purchaseCreateArg = txPurchaseCreate.mock.calls[0][0];
      expect(purchaseCreateArg.data).toMatchObject({
        userId: 'user-1',
        itemId: created.id,
        price: 8.5,
      });
      expect(result.id).toBe(created.id);
    });
  });

  describe('sell', () => {
    it('throws NotFoundException when the item does not belong to the user', async () => {
      itemRepository.findById.mockResolvedValue(null);

      await expect(
        service.sell('item-1', 'user-1', {
          soldPrice: 25,
          soldDate: '2026-06-20',
        }),
      ).rejects.toThrow(NotFoundException);
      expect(prisma.$transaction).not.toHaveBeenCalled();
    });

    it('marks the item as SOLD and creates a linked sale record', async () => {
      itemRepository.findById.mockResolvedValue(buildItem());
      const sold = buildItem({
        status: 'SOLD',
        soldPrice: 25 as never,
        soldDate: new Date('2026-06-20'),
      });
      txItemUpdate.mockResolvedValue(sold);
      txSaleCreate.mockResolvedValue({});

      const result = await service.sell('item-1', 'user-1', {
        soldPrice: 25,
        saleShipping: 4,
        soldDate: '2026-06-20',
        platform: 'Vinted',
      });

      const itemUpdateArg = txItemUpdate.mock.calls[0][0];
      expect(itemUpdateArg.data).toMatchObject({
        status: 'SOLD',
        soldPrice: 25,
      });

      const saleCreateArg = txSaleCreate.mock.calls[0][0];
      expect(saleCreateArg.data).toMatchObject({
        itemId: 'item-1',
        salePrice: 25,
        platform: 'Vinted',
      });
      expect(result.status).toBe('SOLD');
    });
  });

  describe('update', () => {
    it('throws NotFoundException for an item owned by another user', async () => {
      itemRepository.findById.mockResolvedValue(null);

      await expect(
        service.update('item-1', 'user-1', { title: 'New title' }),
      ).rejects.toThrow(NotFoundException);
      expect(itemRepository.update).not.toHaveBeenCalled();
    });
  });

  describe('addImage / removeImage', () => {
    it('appends the uploaded image URL to the item', async () => {
      itemRepository.findById.mockResolvedValue(
        buildItem({ images: ['/uploads/items/old.jpg'] }),
      );
      storageProvider.save.mockResolvedValue('items/new.jpg');
      storageProvider.getUrl.mockReturnValue('/uploads/items/new.jpg');
      itemRepository.update.mockResolvedValue(
        buildItem({
          images: ['/uploads/items/old.jpg', '/uploads/items/new.jpg'],
        }),
      );

      const file = {
        originalname: 'photo.jpg',
        buffer: Buffer.from('data'),
      } as Express.Multer.File;
      const result = await service.addImage('item-1', 'user-1', file);

      expect(itemRepository.update).toHaveBeenCalledWith('item-1', {
        images: ['/uploads/items/old.jpg', '/uploads/items/new.jpg'],
      });
      expect(result.images).toContain('/uploads/items/new.jpg');
    });

    it('rejects removing an image that does not belong to the item', async () => {
      itemRepository.findById.mockResolvedValue(
        buildItem({ images: ['/uploads/items/a.jpg'] }),
      );

      await expect(
        service.removeImage('item-1', 'user-1', '/uploads/items/unknown.jpg'),
      ).rejects.toThrow('Image does not belong to this item');
    });
  });
});
