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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const item_repository_interface_1 = require("../items/repositories/item.repository.interface");
const dashboard_stats_response_dto_1 = require("./dto/dashboard-stats-response.dto");
const CHART_MONTHS = 6;
const MONTHS_DE = [
    'Jan',
    'Feb',
    'Mär',
    'Apr',
    'Mai',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Okt',
    'Nov',
    'Dez',
];
function getLastMonthBounds(now, count) {
    const bounds = [];
    for (let i = count - 1; i >= 0; i--) {
        const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
        bounds.push({ label: MONTHS_DE[from.getMonth()], from, to });
    }
    return bounds;
}
let DashboardService = class DashboardService {
    itemRepository;
    constructor(itemRepository) {
        this.itemRepository = itemRepository;
    }
    async getStats(userId) {
        const monthBounds = getLastMonthBounds(new Date(), CHART_MONTHS);
        const [monthlyAggregates, stock] = await Promise.all([
            Promise.all(monthBounds.map(({ from, to }) => this.itemRepository.aggregateSold(userId, from, to))),
            this.itemRepository.aggregateStock(userId),
        ]);
        const currentMonth = monthlyAggregates[monthlyAggregates.length - 1];
        const monthlyRevenue = currentMonth.soldPriceSum;
        const monthlyProfit = currentMonth.soldPriceSum -
            currentMonth.saleShippingSum -
            currentMonth.saleFeesSum -
            currentMonth.purchasePriceSum -
            currentMonth.purchaseShippingSum -
            currentMonth.purchaseFeesSum;
        const stockValue = stock.purchasePriceSum + stock.purchaseShippingSum + stock.purchaseFeesSum;
        return new dashboard_stats_response_dto_1.DashboardStatsResponseDto({
            monthlyRevenue,
            monthlyProfit,
            stockValue,
            itemsInStock: stock.count,
            chart: monthBounds.map(({ label }, i) => ({
                month: label,
                revenue: monthlyAggregates[i].soldPriceSum,
            })),
        });
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(item_repository_interface_1.ITEM_REPOSITORY)),
    __metadata("design:paramtypes", [Object])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map