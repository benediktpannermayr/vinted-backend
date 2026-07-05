import { NotFoundException } from '@nestjs/common';
import type { ProductWithCounts } from './repositories/product.repository.interface';
import { ProductsService } from './products.service';

function buildProduct(
  overrides: Partial<ProductWithCounts> = {},
): ProductWithCounts {
  return {
    id: 'product-1',
    title: 'Ralph Lauren Oxford Hemd',
    brand: 'Ralph Lauren',
    category: null,
    notes: null,
    createdAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    userId: 'user-1',
    _count: { searchProfiles: 0, listings: 0 },
    ...overrides,
  };
}

describe('ProductsService', () => {
  let service: ProductsService;
  let repository: {
    findAllForUser: jest.Mock;
    findById: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    delete: jest.Mock;
  };

  beforeEach(() => {
    repository = {
      findAllForUser: jest.fn(),
      findById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    service = new ProductsService(repository);
  });

  it('creates a product for the given user', async () => {
    repository.create.mockResolvedValue(buildProduct());

    const result = await service.create('user-1', {
      title: 'Ralph Lauren Oxford Hemd',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'user-1',
        title: 'Ralph Lauren Oxford Hemd',
      }),
    );
    expect(result.title).toBe('Ralph Lauren Oxford Hemd');
    expect(result.searchProfileCount).toBe(0);
  });

  it('throws NotFoundException when reading a product owned by another user', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.findOne('product-1', 'user-1')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('assertOwnership returns the product when it belongs to the user', async () => {
    const product = buildProduct();
    repository.findById.mockResolvedValue(product);

    const result = await service.assertOwnership('product-1', 'user-1');

    expect(result).toBe(product);
  });

  it('assertOwnership throws when the product does not belong to the user', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.assertOwnership('product-1', 'user-2'),
    ).rejects.toThrow(NotFoundException);
  });

  it('update rejects when the product does not exist for this user', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(
      service.update('product-1', 'user-1', { title: 'New title' }),
    ).rejects.toThrow(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();
  });

  it('remove deletes the product after an ownership check', async () => {
    repository.findById.mockResolvedValue(buildProduct());

    await service.remove('product-1', 'user-1');

    expect(repository.delete).toHaveBeenCalledWith('product-1');
  });

  it('remove rejects deletion for a product owned by another user', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(service.remove('product-1', 'user-2')).rejects.toThrow(
      NotFoundException,
    );
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
