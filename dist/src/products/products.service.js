"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_response_dto_1 = require("./dto/product-response.dto");
const product_repository_interface_1 = require("./repositories/product.repository.interface");
let ProductsService = class ProductsService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async findAll(userId) {
        const products = await this.productRepository.findAllForUser(userId);
        return products.map((product) => new product_response_dto_1.ProductResponseDto(product));
    }
    async findOne(id, userId) {
        const product = await this.assertOwnership(id, userId);
        return new product_response_dto_1.ProductResponseDto(product);
    }
    async create(userId, dto) {
        const product = await this.productRepository.create({
            userId,
            title: dto.title,
            brand: dto.brand,
            category: dto.category,
            notes: dto.notes,
        });
        return new product_response_dto_1.ProductResponseDto(product);
    }
    async update(id, userId, dto) {
        await this.assertOwnership(id, userId);
        const product = await this.productRepository.update(id, {
            title: dto.title,
            brand: dto.brand,
            category: dto.category,
            notes: dto.notes,
        });
        return new product_response_dto_1.ProductResponseDto(product);
    }
    async remove(id, userId) {
        await this.assertOwnership(id, userId);
        await this.productRepository.delete(id);
    }
    async assertOwnership(id, userId) {
        const product = await this.productRepository.findById(id, userId);
        if (!product) {
            throw new common_1.NotFoundException('Product not found');
        }
        return product;
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(product_repository_interface_1.PRODUCT_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], ProductsService);
//# sourceMappingURL=products.service.js.map