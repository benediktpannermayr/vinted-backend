import { ConfigService } from '@nestjs/config';
import type { LoggerService } from '@nestjs/common';
import { VintedProvider } from './vinted.provider';
import type { MarketplaceSearchCriteria } from './marketplace-provider.interface';

function mockResponse(partial: Record<string, unknown>): Response {
  return partial as unknown as Response;
}

function buildCriteria(
  overrides: Partial<MarketplaceSearchCriteria> = {},
): MarketplaceSearchCriteria {
  return {
    profileName: 'Test profile',
    productTitle: 'Ralph Lauren Oxford Hemd',
    brand: null,
    category: null,
    sizes: [],
    colors: [],
    maxPrice: null,
    ...overrides,
  };
}

describe('VintedProvider', () => {
  let configService: { get: jest.Mock };
  let logger: { warn: jest.Mock };
  let provider: VintedProvider;
  let fetchMock: jest.MockedFunction<typeof fetch>;

  beforeEach(() => {
    configService = {
      get: jest.fn((key: string) => {
        if (key === 'marketplace.vintedBaseUrl') return 'https://www.vinted.de';
        if (key === 'marketplace.vintedPerPage') return 48;
        return undefined;
      }),
    };
    logger = { warn: jest.fn() };

    fetchMock = jest.fn();
    global.fetch = fetchMock;

    provider = new VintedProvider(
      configService as unknown as ConfigService,
      logger as unknown as LoggerService,
    );
  });

  it('maps a well-formed API response into RawMarketplaceListing objects', async () => {
    fetchMock
      .mockResolvedValueOnce(
        mockResponse({
          headers: { getSetCookie: () => ['session=abc; Path=/'] },
        }),
      )
      .mockResolvedValueOnce(
        mockResponse({
          ok: true,
          json: () =>
            Promise.resolve({
              items: [
                {
                  id: 1,
                  title: 'Ralph Lauren Oxford Hemd',
                  price: { amount: '19.99' },
                  brand_title: 'Ralph Lauren',
                  size_title: 'M',
                  status: 'Sehr gut',
                  url: 'https://www.vinted.de/items/1',
                  photo: { full_size_url: 'https://images.vinted.net/1.jpg' },
                  user: { login: 'seller123' },
                },
              ],
            }),
        }),
      );

    const result = await provider.search(buildCriteria());

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      externalId: '1',
      title: 'Ralph Lauren Oxford Hemd',
      price: 19.99,
      brand: 'Ralph Lauren',
      size: 'M',
      color: null,
      condition: 'Sehr gut',
      listingUrl: 'https://www.vinted.de/items/1',
      seller: 'seller123',
      images: ['https://images.vinted.net/1.jpg'],
    });
    expect(result[0].publishedAt).toBeNull();
  });

  it('skips items without a title, url, or a valid positive price', () => {
    const withoutTitle = { url: 'https://x', price: { amount: '5' } };
    const withoutUrl = { title: 'x', price: { amount: '5' } };
    const zeroPrice = { title: 'x', url: 'https://x', price: { amount: '0' } };

    for (const badItem of [withoutTitle, withoutUrl, zeroPrice]) {
      // Access the private mapper through the public search() contract by
      // asserting no crash occurs and unmappable items are filtered out.
      expect(() => provider['mapItem'](badItem)).not.toThrow();
      expect(provider['mapItem'](badItem)).toBeNull();
    }
  });

  it('returns an empty array and logs a warning when Vinted responds with a non-OK status', async () => {
    fetchMock
      .mockResolvedValueOnce(
        mockResponse({ headers: { getSetCookie: () => [] } }),
      )
      .mockResolvedValueOnce(mockResponse({ ok: false, status: 401 }));

    const result = await provider.search(buildCriteria());

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('401'),
      VintedProvider.name,
    );
  });

  it('returns an empty array and logs a warning when the network request throws', async () => {
    fetchMock.mockRejectedValueOnce(new Error('network unreachable'));

    const result = await provider.search(buildCriteria());

    expect(result).toEqual([]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('network unreachable'),
      VintedProvider.name,
    );
  });

  it('folds product title/brand/category + sizes/colors into a single free-text search param', async () => {
    fetchMock
      .mockResolvedValueOnce(
        mockResponse({ headers: { getSetCookie: () => [] } }),
      )
      .mockResolvedValueOnce(
        mockResponse({ ok: true, json: () => Promise.resolve({ items: [] }) }),
      );

    await provider.search(
      buildCriteria({
        productTitle: 'hemd',
        brand: 'Ralph Lauren',
        sizes: ['M'],
        colors: ['blau'],
        maxPrice: 25,
      }),
    );

    const calledUrl = new URL(fetchMock.mock.calls[1][0] as string);
    expect(calledUrl.searchParams.get('search_text')).toBe(
      'hemd Ralph Lauren M blau',
    );
    expect(calledUrl.searchParams.get('price_to')).toBe('25');
  });

  it('keeps the last Set-Cookie value when a cookie name appears more than once', async () => {
    // Regression test: Vinted's homepage response clears a stale
    // access_token_web for one domain and then issues a fresh one for
    // another in the same response. Sending the first (empty) value causes
    // the API call to be rejected with 401.
    fetchMock
      .mockResolvedValueOnce(
        mockResponse({
          headers: {
            getSetCookie: () => [
              'access_token_web=; Max-Age=-1; Domain=.www.vinted.de; Path=/',
              'access_token_web=real-token-value; Max-Age=604800; Domain=.vinted.de; Path=/',
              'anon_id=abc123; Path=/',
            ],
          },
        }),
      )
      .mockResolvedValueOnce(
        mockResponse({ ok: true, json: () => Promise.resolve({ items: [] }) }),
      );

    await provider.search(buildCriteria());

    const [, requestInit] = fetchMock.mock.calls[1];
    const cookieHeader = (requestInit as RequestInit).headers as Record<
      string,
      string
    >;
    expect(cookieHeader.Cookie).toContain('access_token_web=real-token-value');
    expect(cookieHeader.Cookie).not.toContain('access_token_web=;');
  });

  it('searchByText builds a query without price_to', async () => {
    fetchMock
      .mockResolvedValueOnce(
        mockResponse({ headers: { getSetCookie: () => [] } }),
      )
      .mockResolvedValueOnce(
        mockResponse({ ok: true, json: () => Promise.resolve({ items: [] }) }),
      );

    await provider.searchByText('ralph lauren hemd');

    const calledUrl = new URL(fetchMock.mock.calls[1][0] as string);
    expect(calledUrl.searchParams.get('search_text')).toBe('ralph lauren hemd');
    expect(calledUrl.searchParams.has('price_to')).toBe(false);
  });
});
