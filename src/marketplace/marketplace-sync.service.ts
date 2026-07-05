import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { mapVintedConditionLabel } from '../common/utils/vinted-condition.util';
import {
  LISTING_REPOSITORY,
  type IListingRepository,
} from './listings/repositories/listing.repository.interface';
import { MARKETPLACE_PROVIDER } from './providers/marketplace-provider.interface';
import type {
  IMarketplaceProvider,
  RawMarketplaceListing,
} from './providers/marketplace-provider.interface';
import {
  SEARCH_PROFILE_REPOSITORY,
  type ISearchProfileRepository,
  type SearchProfileWithProduct,
} from './search-profiles/repositories/search-profile.repository.interface';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isDue(profile: SearchProfileWithProduct, now: Date): boolean {
  if (!profile.lastRunAt) return true;
  const dueAt =
    profile.lastRunAt.getTime() + profile.refreshIntervalMinutes * 60_000;
  return now.getTime() >= dueAt;
}

@Injectable()
export class MarketplaceSyncService {
  private readonly logger = new Logger(MarketplaceSyncService.name);

  constructor(
    @Inject(SEARCH_PROFILE_REPOSITORY)
    private readonly searchProfileRepository: ISearchProfileRepository,
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: IListingRepository,
    @Inject(MARKETPLACE_PROVIDER)
    private readonly vintedProvider: IMarketplaceProvider,
    private readonly configService: ConfigService,
  ) {}

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleCron(): Promise<void> {
    if (!this.configService.get<boolean>('marketplace.syncEnabled')) {
      return;
    }

    const batchSize = this.configService.get<number>(
      'marketplace.syncBatchSize',
    )!;
    const requestDelayMs = this.configService.get<number>(
      'marketplace.syncRequestDelayMs',
    )!;

    const activeProfiles = await this.searchProfileRepository.findActive();
    const now = new Date();
    const dueProfiles = activeProfiles
      .filter((profile) => isDue(profile, now))
      .slice(0, batchSize);

    if (dueProfiles.length === 0) {
      return;
    }

    this.logger.log(
      `Running marketplace sync for ${dueProfiles.length} due search profile(s).`,
    );

    for (const [index, profile] of dueProfiles.entries()) {
      await this.runProfile(profile);
      if (index < dueProfiles.length - 1) {
        await delay(requestDelayMs);
      }
    }
  }

  async runNow(id: string, userId: string): Promise<{ found: number }> {
    const profile = await this.searchProfileRepository.findById(id, userId);
    if (!profile) {
      throw new NotFoundException('Search profile not found');
    }
    return this.runProfile(profile);
  }

  private async runProfile(
    profile: SearchProfileWithProduct,
  ): Promise<{ found: number }> {
    const rawListings = await this.vintedProvider.search({
      profileName: profile.name,
      productTitle: profile.product.title,
      brand: profile.product.brand,
      category: profile.product.category,
      sizes: profile.sizes,
      colors: profile.colors,
      maxPrice: profile.maxPrice ? Number(profile.maxPrice) : null,
    });

    for (const raw of rawListings) {
      await this.upsertListing(raw, profile.productId);
    }

    await this.searchProfileRepository.markRun(profile.id, new Date());
    this.logger.log(
      `Search profile "${profile.name}" found ${rawListings.length} listing(s).`,
    );

    return { found: rawListings.length };
  }

  private async upsertListing(raw: RawMarketplaceListing, productId: string) {
    await this.listingRepository.upsert(raw.listingUrl, {
      title: raw.title,
      price: raw.price,
      brand: raw.brand,
      category: raw.category,
      size: raw.size,
      color: raw.color,
      condition: mapVintedConditionLabel(raw.condition),
      images: raw.images,
      listingUrl: raw.listingUrl,
      seller: raw.seller,
      publishedAt: raw.publishedAt,
      source: this.vintedProvider.source,
      productId,
    });
  }
}
