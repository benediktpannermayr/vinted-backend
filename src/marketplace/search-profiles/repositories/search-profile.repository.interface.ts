import type { Prisma, Product, SearchProfile } from '@prisma/client';

export type SearchProfileWithProduct = SearchProfile & { product: Product };

export interface ISearchProfileRepository {
  findAllForUser(userId: string): Promise<SearchProfileWithProduct[]>;
  findById(
    id: string,
    userId: string,
  ): Promise<SearchProfileWithProduct | null>;
  create(
    data: Prisma.SearchProfileUncheckedCreateInput,
  ): Promise<SearchProfileWithProduct>;
  update(
    id: string,
    data: Prisma.SearchProfileUncheckedUpdateInput,
  ): Promise<SearchProfileWithProduct>;
  delete(id: string): Promise<void>;
  findActive(): Promise<SearchProfileWithProduct[]>;
  markRun(id: string, ranAt: Date): Promise<void>;
}

export const SEARCH_PROFILE_REPOSITORY = 'SEARCH_PROFILE_REPOSITORY';
