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
let PrismaItemRepository = class PrismaItemRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    buildWhere(filters) {
        return {
            userId: filters.userId,
            status: filters.status,
            brand: filters.brand
                ? { equals: filters.brand, mode: 'insensitive' }
                : undefined,
            category: filters.category
                ? { equals: filters.category, mode: 'insensitive' }
                : undefined,
            size: filters.size
                ? { equals: filters.size, mode: 'insensitive' }
                : undefined,
            condition: filters.condition,
            title: filters.search
                ? { contains: filters.search, mode: 'insensitive' }
                : undefined,
        };
    }
    findMany(options) {
        return this.prisma.item.findMany({
            where: this.buildWhere(options),
            orderBy: { [options.sortBy]: options.sortOrder },
            skip: options.skip,
            take: options.take,
        });
    }
    count(filters) {
        return this.prisma.item.count({ where: this.buildWhere(filters) });
    }
    findById(id, userId) {
        return this.prisma.item.findFirst({ where: { id, userId } });
    }
    create(data) {
        return this.prisma.item.create({ data });
    }
    update(id, data) {
        return this.prisma.item.update({ where: { id }, data });
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
};
exports.PrismaItemRepository = PrismaItemRepository;
exports.PrismaItemRepository = PrismaItemRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PrismaItemRepository);
//# sourceMappingURL=item.repository.prisma.js.map