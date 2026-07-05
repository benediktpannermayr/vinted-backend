import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { mapVintedConditionLabel } from '../common/utils/vinted-condition.util';
import {
  LISTING_REPOSITORY,
  type IListingRepository,
} from '../marketplace/listings/repositories/listing.repository.interface';
import {
  MARKETPLACE_PROVIDER,
  type IMarketplaceProvider,
} from '../marketplace/providers/marketplace-provider.interface';
import { ImportPreviewResponseDto } from './dto/import-preview-response.dto';

const LISTING_URL_PATTERN = /\/items\/(\d+)(?:-([a-z0-9-]+))?/i;

@Injectable()
export class ImportListingPreviewService {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: IListingRepository,
    @Inject(MARKETPLACE_PROVIDER)
    private readonly marketplaceProvider: IMarketplaceProvider,
  ) {}

  async preview(listingUrl: string): Promise<ImportPreviewResponseDto> {
    const match = listingUrl.match(LISTING_URL_PATTERN);
    if (!match) {
      throw new BadRequestException('Keine gültige Vinted-Artikel-URL');
    }
    const [, externalId, slug] = match;

    const cached = await this.listingRepository.findByUrl(listingUrl);
    if (cached) {
      return new ImportPreviewResponseDto({
        matchType: 'CACHED',
        listingUrl,
        title: cached.title,
        brand: cached.brand,
        size: cached.size,
        condition: cached.condition,
        suggestedPurchasePrice: Number(cached.price),
        images: cached.images,
        seller: cached.seller,
      });
    }

    const slugWords = slug ? slug.replace(/-/g, ' ') : '';
    const results = slugWords
      ? await this.marketplaceProvider.searchByText(slugWords)
      : [];
    const liveMatch = results.find(
      (result) => result.externalId === externalId,
    );

    if (liveMatch) {
      // Seed the cache so the listing is visible on the Marketplace page and
      // remains claimable by a matching search profile later on (see the
      // "first non-null productId wins" upsert policy).
      await this.listingRepository.upsert(liveMatch.listingUrl, {
        title: liveMatch.title,
        price: liveMatch.price,
        brand: liveMatch.brand,
        category: liveMatch.category,
        size: liveMatch.size,
        color: liveMatch.color,
        condition: mapVintedConditionLabel(liveMatch.condition),
        images: liveMatch.images,
        listingUrl: liveMatch.listingUrl,
        seller: liveMatch.seller,
        publishedAt: liveMatch.publishedAt,
        source: this.marketplaceProvider.source,
        productId: null,
      });

      return new ImportPreviewResponseDto({
        matchType: 'LIVE_SEARCH',
        listingUrl: liveMatch.listingUrl,
        title: liveMatch.title,
        brand: liveMatch.brand,
        size: liveMatch.size,
        condition: mapVintedConditionLabel(liveMatch.condition),
        suggestedPurchasePrice: liveMatch.price,
        images: liveMatch.images,
        seller: liveMatch.seller,
      });
    }

    return new ImportPreviewResponseDto({ matchType: 'NOT_FOUND', listingUrl });
  }
}
