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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaItemRepository = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const WITH_PRODUCT = { include: { product: true } };
let PrismaItemRepository = class PrismaItemRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildWhere(filters) {
        return {
            userId: filters.userId,
            status: filters.status,
            productId: filters.productId,
            size: filters.size
                ? { equals: filters.size, mode: 'insensitive' }
                : undefined,
            condition: filters.condition,
            product: filters.search
                ? { title: { contains: filters.search, mode: 'insensitive' } }
                : undefined,
        };
    }
    buildOrderBy(sortBy, sortOrder) {
        if (sortBy === 'productTitle') {
            return { product: { title: sortOrder } };
        }
        return { [sortBy]: sortOrder };
    }
    findMany(options) {
        return this.prisma.item.findMany({
            where: this.buildWhere(options),
            orderBy: this.buildOrderBy(options.sortBy, options.sortOrder),
            skip: options.skip,
            take: options.take,
            ...WITH_PRODUCT,
        });
    }
    count(filters) {
        return this.prisma.item.count({ where: this.buildWhere(filters) });
    }
    findById(id, userId) {
        return this.prisma.item.findFirst({
            where: { id, userId },
            ...WITH_PRODUCT,
        });
    }
    create(data) {
        return this.prisma.item.create({ data, ...WITH_PRODUCT });
    }
    update(id, data) {
        return this.prisma.item.update({
            where: { id },
            data,
            ...WITH_PRODUCT,
        });
    }
    async delete(id) {
        await this.prisma.item.delete({ where: { id } });
    }
    async updateManyStatus(ids, userId, status) {
        const result = await this.prisma.item.updateMany({
            where: { id: { in: ids }, userId },
            data: { status },
        });
        return result.count;
    }
    async aggregateSold(userId, from, to) {
        const result = await this.prisma.item.aggregate({
            where: { userId, status: 'SOLD', soldDate: { gte: from, lt: to } },
            _sum: {
                soldPrice: true,
                saleShipping: true,
                saleFees: true,
                purchasePrice: true,
                purchaseShipping: true,
                purchaseFees: true,
            },
        });
        return {
            soldPriceSum: Number(result._sum.soldPrice ?? 0),
            saleShippingSum: Number(result._sum.saleShipping ?? 0),
            saleFeesSum: Number(result._sum.saleFees ?? 0),
            purchasePriceSum: Number(result._sum.purchasePrice ?? 0),
            purchaseShippingSum: Number(result._sum.purchaseShipping ?? 0),
            purchaseFeesSum: Number(result._sum.purchaseFees ?? 0),
        };
    }
    async aggregateStock(userId) {
        const result = await this.prisma.item.aggregate({
            where: { userId, status: { not: 'SOLD' } },
            _sum: {
                purchasePrice: true,
                purchaseShipping: true,
                purchaseFees: true,
            },
            _count: true,
        });
        return {
            purchasePriceSum: Number(result._sum.purchasePrice ?? 0),
            purchaseShippingSum: Number(result._sum.purchaseShipping ?? 0),
            purchaseFeesSum: Number(result._sum.purchaseFees ?? 0),
            count: result._count,
        };
    }
};
exports.PrismaItemRepository = PrismaItemRepository;
exports.PrismaItemRepository = PrismaItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaItemRepository);
//# sourceMappingURL=item.repository.prisma.js.map