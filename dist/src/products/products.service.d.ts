import type { CreateProductDto } from './dto/create-product.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import type { UpdateProductDto } from './dto/update-product.dto';
import { type IProductRepository } from './repositories/product.repository.interface';
export declare class ProductsService {
    private readonly productRepository;
    constructor(productRepository: IProductRepository);
    findAll(userId: string): Promise<ProductResponseDto[]>;
    findOne(id: string, userId: string): Promise<ProductResponseDto>;
    create(userId: string, dto: CreateProductDto): Promise<ProductResponseDto>;
    update(id: string, userId: string, dto: UpdateProductDto): Promise<ProductResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    assertOwnership(id: string, userId: string): Promise<import("./repositories/product.repository.interface").ProductWithCounts>;
}
