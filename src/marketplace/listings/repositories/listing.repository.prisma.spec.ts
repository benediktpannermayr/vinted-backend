import { PrismaListingRepository } from './listing.repository.prisma';

interface FakeListingRow {
  productId: string | null;
}

interface UpsertCall {
  data: { productId?: string | null };
}

describe('PrismaListingRepository.upsert productId policy', () => {
  let prisma: {
    marketplaceListing: {
      findUnique: jest.Mock<Promise<FakeListingRow | null>, [unknown]>;
      create: jest.Mock<Promise<unknown>, [UpsertCall]>;
      update: jest.Mock<Promise<unknown>, [UpsertCall]>;
    };
  };
  let repository: PrismaListingRepository;

  beforeEach(() => {
    prisma = {
      marketplaceListing: {
        findUnique: jest.fn<Promise<FakeListingRow | null>, [unknown]>(),
        create: jest.fn<Promise<unknown>, [UpsertCall]>(),
        update: jest.fn<Promise<unknown>, [UpsertCall]>(),
      },
    };
    repository = new PrismaListingRepository(prisma as never);
  });

  it('sets productId on create when the listing is new', async () => {
    prisma.marketplaceListing.findUnique.mockResolvedValue(null);
    prisma.marketplaceListing.create.mockResolvedValue({});

    await repository.upsert('https://x/items/1', {
      listingUrl: 'https://x/items/1',
      productId: 'product-a',
    } as never);

    const createArg = prisma.marketplaceListing.create.mock.calls[0][0];
    expect(createArg.data.productId).toBe('product-a');
  });

  it('claims a null productId for an already-cached listing on update', async () => {
    prisma.marketplaceListing.findUnique.mockResolvedValue({ productId: null });
    prisma.marketplaceListing.update.mockResolvedValue({});

    await repository.upsert('https://x/items/1', {
      listingUrl: 'https://x/items/1',
      productId: 'product-a',
    } as never);

    const updateArg = prisma.marketplaceListing.update.mock.calls[0][0];
    expect(updateArg.data.productId).toBe('product-a');
  });

  it('never overwrites an already-set productId, even with a different incoming value', async () => {
    prisma.marketplaceListing.findUnique.mockResolvedValue({
      productId: 'product-a',
    });
    prisma.marketplaceListing.update.mockResolvedValue({});

    await repository.upsert('https://x/items/1', {
      listingUrl: 'https://x/items/1',
      productId: 'product-b',
    } as never);

    const updateArg = prisma.marketplaceListing.update.mock.calls[0][0];
    expect(updateArg.data.productId).toBe('product-a');
  });

  it('leaves productId undefined when neither the existing row nor the incoming data has one', async () => {
    prisma.marketplaceListing.findUnique.mockResolvedValue({ productId: null });
    prisma.marketplaceListing.update.mockResolvedValue({});

    await repository.upsert('https://x/items/1', {
      listingUrl: 'https://x/items/1',
    } as never);

    const updateArg = prisma.marketplaceListing.update.mock.calls[0][0];
    expect(updateArg.data.productId).toBeUndefined();
  });
});
