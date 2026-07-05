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
exports.DashboardStatsResponseDto = exports.MonthlyRevenuePointDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
let MonthlyRevenuePointDto = class MonthlyRevenuePointDto {
    month;
    revenue;
};
exports.MonthlyRevenuePointDto = MonthlyRevenuePointDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Monat, z. B. "Jul"' }),
    __metadata("design:type", String)
], MonthlyRevenuePointDto.prototype, "month", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], MonthlyRevenuePointDto.prototype, "revenue", void 0);
exports.MonthlyRevenuePointDto = MonthlyRevenuePointDto = __decorate([
    (0, class_transformer_1.Exclude)()
], MonthlyRevenuePointDto);
let DashboardStatsResponseDto = class DashboardStatsResponseDto {
    monthlyRevenue;
    monthlyProfit;
    stockValue;
    itemsInStock;
    chart;
    constructor(data) {
        this.monthlyRevenue = round2(data.monthlyRevenue);
        this.monthlyProfit = round2(data.monthlyProfit);
        this.stockValue = round2(data.stockValue);
        this.itemsInStock = data.itemsInStock;
        this.chart = data.chart.map((point) => ({
            month: point.month,
            revenue: round2(point.revenue),
        }));
    }
};
exports.DashboardStatsResponseDto = DashboardStatsResponseDto;
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Umsatz im aktuellen Kalendermonat (EUR)' }),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "monthlyRevenue", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Gewinn im aktuellen Kalendermonat (EUR)' }),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "monthlyProfit", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Lagerwert: Summe Einkaufspreis+Versand+Gebühren für nicht verkaufte Artikel (EUR)',
    }),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "stockValue", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Anzahl Artikel im Lager (Status != SOLD)' }),
    __metadata("design:type", Number)
], DashboardStatsResponseDto.prototype, "itemsInStock", void 0);
__decorate([
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        type: [MonthlyRevenuePointDto],
        description: 'Umsatz je Monat, letzte 6 Kalendermonate, älteste zuerst',
    }),
    (0, class_transformer_1.Type)(() => MonthlyRevenuePointDto),
    __metadata("design:type", Array)
], DashboardStatsResponseDto.prototype, "chart", void 0);
exports.DashboardStatsResponseDto = DashboardStatsResponseDto = __decorate([
    (0, class_transformer_1.Exclude)(),
    __metadata("design:paramtypes", [Object])
], DashboardStatsResponseDto);
function round2(value) {
    return Math.round(value * 100) / 100;
}
//# sourceMappingURL=dashboard-stats-response.dto.js.map