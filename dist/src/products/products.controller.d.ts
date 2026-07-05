import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(user: AuthenticatedUser): Promise<import("./dto/product-response.dto").ProductResponseDto[]>;
    create(user: AuthenticatedUser, dto: CreateProductDto): Promise<import("./dto/product-response.dto").ProductResponseDto>;
    findOne(id: string, user: AuthenticatedUser): Promise<import("./dto/product-response.dto").ProductResponseDto>;
    update(id: string, user: AuthenticatedUser, dto: UpdateProductDto): Promise<import("./dto/product-response.dto").ProductResponseDto>;
    remove(id: string, user: AuthenticatedUser): Promise<void>;
}
