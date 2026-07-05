import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import type {
  ISearchProfileRepository,
  SearchProfileWithProduct,
} from './search-profile.repository.interface';

const WITH_PRODUCT = { include: { product: true } } as const;

@Injectable()
export class PrismaSearchProfileRepository implements ISearchProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAllForUser(userId: string): Promise<SearchProfileWithProduct[]> {
    return this.prisma.searchProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      ...WITH_PRODUCT,
    });
  }

  findById(
    id: string,
    userId: string,
  ): Promise<SearchProfileWithProduct | null> {
    return this.prisma.searchProfile.findFirst({
      where: { id, userId },
      ...WITH_PRODUCT,
    });
  }

  create(
    data: Prisma.SearchProfileUncheckedCreateInput,
  ): Promise<SearchProfileWithProduct> {
    return this.prisma.searchProfile.create({ data, ...WITH_PRODUCT });
  }

  update(
    id: string,
    data: Prisma.SearchProfileUncheckedUpdateInput,
  ): Promise<SearchProfileWithProduct> {
    return this.prisma.searchProfile.update({
      where: { id },
      data,
      ...WITH_PRODUCT,
    });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.searchProfile.delete({ where: { id } });
  }

  findActive(): Promise<SearchProfileWithProduct[]> {
    return this.prisma.searchProfile.findMany({
      where: { isActive: true },
      ...WITH_PRODUCT,
    });
  }

  async markRun(id: string, ranAt: Date): Promise<void> {
    await this.prisma.searchProfile.update({
      where: { id },
      data: { lastRunAt: ranAt },
    });
  }
}
