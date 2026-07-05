import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ListingResponseDto } from './dto/listing-response.dto';
import type { QueryListingsDto } from './dto/query-listings.dto';
import {
  LISTING_REPOSITORY,
  type IListingRepository,
} from './repositories/listing.repository.interface';
import {
  ListingScoringService,
  type SimilarSale,
} from './scoring/listing-scoring.service';

export interface PaginatedListings {
  items: ListingResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

const SIMILAR_SALES_LOOKBACK = 200;

@Injectable()
export class ListingsService {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: IListingRepository,
    private readonly scoringService: ListingScoringService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(
    userId: string,
    query: QueryListingsDto,
  ): Promise<PaginatedListings> {
    const filters = {
      search: query.search,
      brand: query.brand,
      category: query.category,
      size: query.size,
      color: query.color,
      productId: query.productId,
      condition: query.condition,
      maxPrice: query.maxPrice,
      source: query.source,
      isFavorite: query.isFavorite,
    };

    const [listings, total, soldItems, watchlistedIds] = await Promise.all([
      this.listingRepository.findMany({
        ...filters,
        sortBy: query.sortBy,
        sortOrder: query.sortOrder,
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.listingRepository.count(filters),
      this.findRecentSoldItems(userId),
      this.findWatchlistedIds(userId),
    ]);

    const items = listings.map((listing) => {
      const similarSales = this.findSimilarSales(
        soldItems,
        listing.brand,
        listing.category,
      );
      const scoreResult = this.scoringService.score({
        price: Number(listing.price),
        similarSales,
      });
      return new ListingResponseDto(
        listing,
        scoreResult,
        watchlistedIds.has(listing.id),
      );
    });

    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  async findOne(id: string, userId: string): Promise<ListingResponseDto> {
    const listing = await this.listingRepository.findById(id);
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const [soldItems, watchlistedIds] = await Promise.all([
      this.findRecentSoldItems(userId),
      this.findWatchlistedIds(userId),
    ]);

    const similarSales = this.findSimilarSales(
      soldItems,
      listing.brand,
      listing.category,
    );
    const scoreResult = this.scoringService.score({
      price: Number(listing.price),
      similarSales,
    });

    return new ListingResponseDto(listing, scoreResult, watchlistedIds.has(id));
  }

  private async findRecentSoldItems(userId: string) {
    return this.prisma.item.findMany({
      where: { userId, status: 'SOLD', soldDate: { not: null } },
      select: {
        brand: true,
        category: true,
        soldPrice: true,
        purchasePrice: true,
        purchaseDate: true,
        soldDate: true,
      },
      orderBy: { soldDate: 'desc' },
      take: SIMILAR_SALES_LOOKBACK,
    });
  }

  private async findWatchlistedIds(userId: string): Promise<Set<string>> {
    const entries = await this.prisma.watchlist.findMany({
      where: { userId },
      select: { marketplaceListingId: true },
    });
    return new Set(entries.map((entry) => entry.marketplaceListingId));
  }

  private findSimilarSales(
    soldItems: Awaited<ReturnType<ListingsService['findRecentSoldItems']>>,
    brand: string | null,
    category: string | null,
  ): SimilarSale[] {
    return soldItems
      .filter(
        (item) =>
          (brand && item.brand === brand) ||
          (category && item.category === category),
      )
      .filter(
        (item) =>
          item.soldPrice !== null &&
          item.purchasePrice !== null &&
          item.soldDate,
      )
      .map((item) => ({
        soldPrice: Number(item.soldPrice),
        purchasePrice: Number(item.purchasePrice),
        daysToSell: Math.max(
          0,
          Math.round(
            (item.soldDate!.getTime() -
              (item.purchaseDate ?? item.soldDate!).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
      }));
  }
}
