import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import {
  PRODUCT_REPOSITORY,
  type IProductRepository,
} from './repositories/product.repository.interface';

@Injectable()
export class ProductsService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
  ) {}

  async findAll(userId: string): Promise<ProductResponseDto[]> {
    const products = await this.productRepository.findAllForUser(userId);
    return products.map((product) => new ProductResponseDto(product));
  }

  async findOne(id: string, userId: string): Promise<ProductResponseDto> {
    const product = await this.assertOwnership(id, userId);
    return new ProductResponseDto(product);
  }

  async create(
    userId: string,
    dto: CreateProductDto,
  ): Promise<ProductResponseDto> {
    const product = await this.productRepository.create({
      userId,
      title: dto.title,
      brand: dto.brand,
      category: dto.category,
      notes: dto.notes,
    });
    return new ProductResponseDto(product);
  }

  async update(
    id: string,
    userId: string,
    dto: UpdateProductDto,
  ): Promise<ProductResponseDto> {
    await this.assertOwnership(id, userId);
    const product = await this.productRepository.update(id, {
      title: dto.title,
      brand: dto.brand,
      category: dto.category,
      notes: dto.notes,
    });
    return new ProductResponseDto(product);
  }

  async remove(id: string, userId: string): Promise<void> {
    await this.assertOwnership(id, userId);
    await this.productRepository.delete(id);
  }

  /** Used by SearchProfilesService to validate cross-module ownership before binding a search profile to a product. */
  async assertOwnership(id: string, userId: string) {
    const product = await this.productRepository.findById(id, userId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
}
