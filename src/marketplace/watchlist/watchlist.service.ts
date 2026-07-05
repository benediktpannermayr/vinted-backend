import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ListingsService } from '../listings/listings.service';
import type { CreateWatchlistItemDto } from './dto/create-watchlist-item.dto';
import { WatchlistItemResponseDto } from './dto/watchlist-item-response.dto';

// Thin join-table CRUD — talks to Prisma directly rather than through a
// dedicated repository, unlike Items/SearchProfiles/Listings, since there is
// no meaningful query logic here worth abstracting behind an interface.
@Injectable()
export class WatchlistService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly listingsService: ListingsService,
  ) {}

  async findAll(userId: string): Promise<WatchlistItemResponseDto[]> {
    const entries = await this.prisma.watchlist.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return Promise.all(
      entries.map(async (entry) => {
        const listing = await this.listingsService.findOne(
          entry.marketplaceListingId,
          userId,
        );
        return new WatchlistItemResponseDto(
          entry.id,
          entry.note,
          entry.createdAt,
          listing,
        );
      }),
    );
  }

  async create(
    userId: string,
    dto: CreateWatchlistItemDto,
  ): Promise<WatchlistItemResponseDto> {
    const listing = await this.prisma.marketplaceListing.findUnique({
      where: { id: dto.marketplaceListingId },
    });
    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    const existing = await this.prisma.watchlist.findUnique({
      where: {
        userId_marketplaceListingId: {
          userId,
          marketplaceListingId: dto.marketplaceListingId,
        },
      },
    });
    if (existing) {
      throw new ConflictException('Listing is already on the watchlist');
    }

    const entry = await this.prisma.watchlist.create({
      data: {
        userId,
        marketplaceListingId: dto.marketplaceListingId,
        note: dto.note,
      },
    });

    const listingDto = await this.listingsService.findOne(
      dto.marketplaceListingId,
      userId,
    );
    return new WatchlistItemResponseDto(
      entry.id,
      entry.note,
      entry.createdAt,
      listingDto,
    );
  }

  async remove(id: string, userId: string): Promise<void> {
    const entry = await this.prisma.watchlist.findFirst({
      where: { id, userId },
    });
    if (!entry) {
      throw new NotFoundException('Watchlist entry not found');
    }
    await this.prisma.watchlist.delete({ where: { id } });
  }
}
