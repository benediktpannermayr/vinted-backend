import { ProductsService } from '../../products/products.service';
import { CreateSearchProfileDto } from './dto/create-search-profile.dto';
import { SearchProfileResponseDto } from './dto/search-profile-response.dto';
import type { UpdateSearchProfileDto } from './dto/update-search-profile.dto';
import { type ISearchProfileRepository } from './repositories/search-profile.repository.interface';
export declare class SearchProfilesService {
    private readonly repository;
    private readonly productsService;
    constructor(repository: ISearchProfileRepository, productsService: ProductsService);
    findAll(userId: string): Promise<SearchProfileResponseDto[]>;
    findOne(id: string, userId: string): Promise<SearchProfileResponseDto>;
    create(userId: string, dto: CreateSearchProfileDto): Promise<SearchProfileResponseDto>;
    update(id: string, userId: string, dto: UpdateSearchProfileDto): Promise<SearchProfileResponseDto>;
    remove(id: string, userId: string): Promise<void>;
    private assertOwnership;
}
