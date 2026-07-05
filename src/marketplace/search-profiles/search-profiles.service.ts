import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from '../../products/products.service';
import { CreateSearchProfileDto } from './dto/create-search-profile.dto';
import { SearchProfileResponseDto } from './dto/search-profile-response.dto';
import type { UpdateSearchProfileDto } from './dto/update-search-profile.dto';
import {
  SEARCH_PROFILE_REPOSITORY,
  type ISearchProfileRepository,
} from './repositories/search-profile.repository.interface';

@Injectable()
export class SearchProfilesService {
  constructor(
    @Inject(SEARCH_PROFILE_REPOSITORY)
    private readonly repository: ISearchProfileRepository,
    private readonly productsService: ProductsService,
  ) {}

  async findAll(userId: string): Promise<SearchProfileResponseDto[]> {
    const profiles = await this.repository.findAllForUser(userId);
    return profiles.map((profile) => new SearchProfileResponseDto(profile));
  }

  async findOne(id: string, userId: string): Promise<SearchProfileResponseDto> {
    const profile = await this.assertOwnership(id, userId);
    return new SearchProfileResponseDto(profile);
  }

  async create(
    userId: string,
    dto: CreateSearchProfileDto,
  ): Promise<SearchProfileResponseDto> {
    await this.productsService.assertOwnership(dto.productId, userId);

    const profile = await this.repository.create({
      userId,
      name: dto.name,
      productId: dto.productId,
      sizes: dto.sizes ?? [],
      colors: dto.colors ?? [],
      maxPrice: dto.maxPrice,
      condition: dto.condition,
      isActive: dto.isActive ?? true,
      refreshIntervalMinutes: dto.refreshIntervalMinutes ?? 60,
    });
    return new SearchProfileResponseDto(profile);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateSearchProfileDto,
  ): Promise<SearchProfileResponseDto> {
    await this.assertOwnership(id, userId);
    if (dto.productId) {
      await this.productsService.assertOwnership(dto.productId, userId);
    }

    const profile = await this.repository.update(id, {
      name: dto.name,
      productId: dto.productId,
      sizes: dto.sizes,
      colors: dto.colors,
      maxPrice: dto.maxPrice,
      condition: dto.condition,
      isActive: dto.isActive,
      refreshIntervalMinutes: dto.refreshIntervalMinutes,
    });
    return new SearchProfileResponseDto(profile);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.assertOwnership(id, userId);
    await this.repository.delete(id);
  }

  private async assertOwnership(id: string, userId: string) {
    const profile = await this.repository.findById(id, userId);
    if (!profile) {
      throw new NotFoundException('Search profile not found');
    }
    return profile;
  }
}
