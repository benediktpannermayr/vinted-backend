import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  IListingRepository,
  ListingFilters,
  ListingQueryOptions,
  ListingWithProduct,
} from './listing.repository.interface';

const WITH_PRODUCT = {
  include: { product: { select: { id: true, title: true } } },
} as const;

@Injectable()
export class PrismaListingRepository implements IListingRepository {
  constructor(private readonly prisma: PrismaService) {}

  private buildWhere(
    filters: ListingFilters,
  ): Prisma.MarketplaceListingWhereInput {
    return {
      title: filters.search
        ? { contains: filters.search, mode: 'insensitive' }
        : undefined,
      brand: filters.brand
        ? { equals: filters.brand, mode: 'insensitive' }
        : undefined,
      category: filters.category
        ? { equals: filters.category, mode: 'insensitive' }
        : undefined,
      size: filters.size
        ? { equals: filters.size, mode: 'insensitive' }
        : undefined,
      color: filters.color
        ? { equals: filters.color, mode: 'insensitive' }
        : undefined,
      condition: filters.condition as never,
      price: filters.maxPrice ? { lte: filters.maxPrice } : undefined,
      source: filters.source as never,
      isFavorite: filters.isFavorite,
      productId: filters.productId,
    };
  }

  findMany(options: ListingQueryOptions): Promise<ListingWithProduct[]> {
    return this.prisma.marketplaceListing.findMany({
      where: this.buildWhere(options),
      orderBy: { [options.sortBy]: options.sortOrder },
      skip: options.skip,
      take: options.take,
      ...WITH_PRODUCT,
    });
  }

  count(filters: ListingFilters): Promise<number> {
    return this.prisma.marketplaceListing.count({
      where: this.buildWhere(filters),
    });
  }

  findById(id: string): Promise<ListingWithProduct | null> {
    return this.prisma.marketplaceListing.findUnique({
      where: { id },
      ...WITH_PRODUCT,
    });
  }

  findByUrl(listingUrl: string): Promise<ListingWithProduct | null> {
    return this.prisma.marketplaceListing.findUnique({
      where: { listingUrl },
      ...WITH_PRODUCT,
    });
  }

  async upsert(
    listingUrl: string,
    data: Prisma.MarketplaceListingUncheckedCreateInput,
  ): Promise<ListingWithProduct> {
    const existing = await this.prisma.marketplaceListing.findUnique({
      where: { listingUrl },
    });

    if (!existing) {
      return this.prisma.marketplaceListing.create({ data, ...WITH_PRODUCT });
    }

    return this.prisma.marketplaceListing.update({
      where: { listingUrl },
      data: {
        title: data.title,
        price: data.price,
        brand: data.brand,
        category: data.category,
        size: data.size,
        color: data.color,
        condition: data.condition,
        images: data.images,
        seller: data.seller,
        publishedAt: data.publishedAt,
        // First non-null productId wins — see IListingRepository.upsert docs.
        productId: existing.productId ?? data.productId,
      },
      ...WITH_PRODUCT,
    });
  }
}
