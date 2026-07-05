import { BadRequestException } from '@nestjs/common';
import type { ListingWithProduct } from '../marketplace/listings/repositories/listing.repository.interface';
import type { RawMarketplaceListing } from '../marketplace/providers/marketplace-provider.interface';
import { ImportListingPreviewService } from './import-listing-preview.service';

function buildCachedListing(
  overrides: Partial<ListingWithProduct> = {},
): ListingWithProduct {
  return {
    id: 'listing-1',
    title: 'Ralph Lauren Oxford Hemd',
    price: 25 as never,
    brand: 'Ralph Lauren',
    category: null,
    size: 'M',
    color: null,
    condition: 'VERY_GOOD',
    images: ['https://images.vinted.net/1.jpg'],
    listingUrl: 'https://www.vinted.de/items/12345-ralph-lauren-oxford-hemd',
    seller: 'seller123',
    publishedAt: null,
    isFavorite: false,
    source: 'VINTED',
    detectedAt: new Date('2026-06-01'),
    updatedAt: new Date('2026-06-01'),
    productId: null,
    product: null,
    ...overrides,
  };
}

function buildRawListing(
  overrides: Partial<RawMarketplaceListing> = {},
): RawMarketplaceListing {
  return {
    externalId: '12345',
    title: 'Ralph Lauren Oxford Hemd',
    price: 25,
    brand: 'Ralph Lauren',
    category: null,
    size: 'M',
    color: null,
    condition: 'Sehr gut',
    images: ['https://images.vinted.net/1.jpg'],
    listingUrl: 'https://www.vinted.de/items/12345-ralph-lauren-oxford-hemd',
    seller: 'seller123',
    publishedAt: null,
    ...overrides,
  };
}

describe('ImportListingPreviewService', () => {
  let service: ImportListingPreviewService;
  let listingRepository: { findByUrl: jest.Mock; upsert: jest.Mock };
  let marketplaceProvider: { searchByText: jest.Mock; source: string };

  beforeEach(() => {
    listingRepository = { findByUrl: jest.fn(), upsert: jest.fn() };
    marketplaceProvider = { searchByText: jest.fn(), source: 'VINTED' };
    service = new ImportListingPreviewService(
      listingRepository as never,
      marketplaceProvider as never,
    );
  });

  it('rejects a URL without an item id', async () => {
    await expect(
      service.preview('https://www.vinted.de/catalog'),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a CACHED match without calling the provider when the listing is already known', async () => {
    listingRepository.findByUrl.mockResolvedValue(buildCachedListing());

    const result = await service.preview(
      'https://www.vinted.de/items/12345-ralph-lauren-oxford-hemd',
    );

    expect(result.matchType).toBe('CACHED');
    expect(result.title).toBe('Ralph Lauren Oxford Hemd');
    expect(result.suggestedPurchasePrice).toBe(25);
    expect(marketplaceProvider.searchByText).not.toHaveBeenCalled();
    expect(listingRepository.upsert).not.toHaveBeenCalled();
  });

  it('falls back to a live search and seeds the cache when the id matches', async () => {
    listingRepository.findByUrl.mockResolvedValue(null);
    marketplaceProvider.searchByText.mockResolvedValue([
      buildRawListing(),
      buildRawListing({
        externalId: '99999',
        listingUrl: 'https://www.vinted.de/items/99999-other',
      }),
    ]);

    const result = await service.preview(
      'https://www.vinted.de/items/12345-ralph-lauren-oxford-hemd',
    );

    expect(result.matchType).toBe('LIVE_SEARCH');
    expect(result.condition).toBe('VERY_GOOD');
    expect(listingRepository.upsert).toHaveBeenCalledWith(
      'https://www.vinted.de/items/12345-ralph-lauren-oxford-hemd',
      expect.objectContaining({ productId: null }),
    );
  });

  it('returns NOT_FOUND when the live search has no matching id and does not upsert', async () => {
    listingRepository.findByUrl.mockResolvedValue(null);
    marketplaceProvider.searchByText.mockResolvedValue([
      buildRawListing({
        externalId: '99999',
        listingUrl: 'https://www.vinted.de/items/99999-other',
      }),
    ]);

    const result = await service.preview(
      'https://www.vinted.de/items/12345-ralph-lauren-oxford-hemd',
    );

    expect(result.matchType).toBe('NOT_FOUND');
    expect(result.title).toBeNull();
    expect(listingRepository.upsert).not.toHaveBeenCalled();
  });
});
