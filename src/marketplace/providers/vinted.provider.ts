import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { MarketplaceSource } from '@prisma/client';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import type { LoggerService } from '@nestjs/common';
import type {
  IMarketplaceProvider,
  MarketplaceSearchCriteria,
  RawMarketplaceListing,
} from './marketplace-provider.interface';

/**
 * Educational, good-faith implementation against Vinted's public catalog
 * search JSON endpoint — the same one their own web frontend calls, with no
 * login required. It does NOT attempt to bypass Vinted's bot protection
 * (Datadome): no CAPTCHA solving, no proxy rotation, no fingerprint spoofing.
 * If Vinted blocks a request (403/429/challenge page), that request is
 * logged and skipped — never retried aggressively.
 *
 * Field names below are reconstructed from public reverse-engineering
 * write-ups (not an official, versioned API), so every read is defensive
 * (optional chaining + fallbacks) and the endpoint/response shape may change
 * without notice.
 */
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';

interface VintedApiItem {
  id?: number | string;
  title?: string;
  price?: { amount?: string | number } | string | number;
  brand_title?: string;
  size_title?: string;
  status?: string;
  url?: string;
  photo?: { url?: string; full_size_url?: string };
  photos?: Array<{ url?: string; full_size_url?: string }>;
  user?: { login?: string };
}

interface VintedApiResponse {
  items?: VintedApiItem[];
}

@Injectable()
export class VintedProvider implements IMarketplaceProvider {
  readonly source: MarketplaceSource = 'VINTED';

  private readonly logger: LoggerService;
  private readonly baseUrl: string;
  private readonly perPage: number;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) logger: LoggerService,
  ) {
    this.logger = logger;
    this.baseUrl = this.configService.get<string>('marketplace.vintedBaseUrl')!;
    this.perPage = this.configService.get<number>('marketplace.vintedPerPage')!;
  }

  search(
    criteria: MarketplaceSearchCriteria,
  ): Promise<RawMarketplaceListing[]> {
    const url = this.buildSearchUrl(criteria);
    return this.fetchAndMap(url, criteria.profileName);
  }

  searchByText(text: string): Promise<RawMarketplaceListing[]> {
    const params = new URLSearchParams();
    params.set('search_text', text);
    params.set('order', 'newest_first');
    params.set('per_page', String(this.perPage));
    params.set('page', '1');
    const url = `${this.baseUrl}/api/v2/catalog/items?${params.toString()}`;
    return this.fetchAndMap(url, `free-text: "${text}"`);
  }

  private async fetchAndMap(
    url: string,
    logLabel: string,
  ): Promise<RawMarketplaceListing[]> {
    try {
      const cookie = await this.fetchSessionCookie();

      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
          Cookie: cookie,
        },
      });

      if (!response.ok) {
        this.logger.warn(
          `Vinted search returned ${response.status} for ${logLabel} — skipping this run.`,
          VintedProvider.name,
        );
        return [];
      }

      const data = (await response.json()) as VintedApiResponse;
      return (data.items ?? [])
        .map((item) => this.mapItem(item))
        .filter(Boolean) as RawMarketplaceListing[];
    } catch (error) {
      this.logger.warn(
        `Vinted search failed for ${logLabel}: ${error instanceof Error ? error.message : String(error)}`,
        VintedProvider.name,
      );
      return [];
    }
  }

  private buildSearchUrl(criteria: MarketplaceSearchCriteria): string {
    const params = new URLSearchParams();

    // Brand/category/size/color filters map to numeric catalog IDs in
    // Vinted's real API, which requires a separate metadata lookup we don't
    // perform here — as a documented, honest simplification we fold them
    // into the free-text search instead of guessing IDs.
    const searchTextParts = [
      criteria.productTitle,
      criteria.brand,
      criteria.category,
      ...criteria.sizes,
      ...criteria.colors,
    ].filter(Boolean);
    if (searchTextParts.length > 0) {
      params.set('search_text', searchTextParts.join(' '));
    }
    if (criteria.maxPrice) {
      params.set('price_to', String(criteria.maxPrice));
    }
    params.set('order', 'newest_first');
    params.set('per_page', String(this.perPage));
    params.set('page', '1');

    return `${this.baseUrl}/api/v2/catalog/items?${params.toString()}`;
  }

  private async fetchSessionCookie(): Promise<string> {
    const response = await fetch(this.baseUrl, {
      headers: { 'User-Agent': USER_AGENT },
    });
    const cookies = response.headers.getSetCookie?.() ?? [];

    // The homepage response sets multiple cookies with the same name (e.g. it
    // clears a stale access_token_web for one domain, then issues a fresh one
    // for another). Set-Cookie order matters — a later entry for the same
    // name overrides an earlier one, exactly like a browser's cookie jar. A
    // naive concat would send the *first* (possibly empty/stale) value and
    // get a 401, so we keep only the last value per cookie name.
    const jar = new Map<string, string>();
    for (const cookie of cookies) {
      const pair = cookie.split(';')[0];
      const separatorIndex = pair.indexOf('=');
      if (separatorIndex === -1) continue;
      const name = pair.slice(0, separatorIndex);
      jar.set(name, pair);
    }

    return [...jar.values()].join('; ');
  }

  private mapItem(item: VintedApiItem): RawMarketplaceListing | null {
    if (!item.title || !item.url) {
      return null;
    }

    const rawPrice =
      typeof item.price === 'object' ? item.price?.amount : item.price;
    const price = Number(rawPrice ?? 0);
    if (!Number.isFinite(price) || price <= 0) {
      return null;
    }

    const images = [
      item.photo?.full_size_url ?? item.photo?.url,
      ...(item.photos?.map((photo) => photo.full_size_url ?? photo.url) ?? []),
    ].filter((url): url is string => Boolean(url));

    return {
      externalId: item.id != null ? String(item.id) : null,
      title: item.title,
      price,
      brand: item.brand_title ?? null,
      category: null,
      size: item.size_title ?? null,
      // The catalog search endpoint doesn't expose a reliable color field —
      // left null rather than guessing at one (see plan doc).
      color: null,
      condition: item.status ?? null,
      images: [...new Set(images)],
      listingUrl: item.url,
      seller: item.user?.login ?? null,
      // The catalog list endpoint doesn't expose a reliable publish
      // timestamp field — left null rather than guessing at one.
      publishedAt: null,
    };
  }
}
