"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingScoringService = void 0;
const common_1 = require("@nestjs/common");
const ASSUMED_FEE_RATE = 0.15;
const TARGET_MARGIN = 0.3;
const FALLBACK_RESALE_MULTIPLIER = 1.6;
let ListingScoringService = class ListingScoringService {
    score({ price, similarSales }) {
        const expectedSalePrice = similarSales.length > 0
            ? average(similarSales.map((sale) => sale.soldPrice))
            : price * FALLBACK_RESALE_MULTIPLIER;
        const expectedProfit = expectedSalePrice * (1 - ASSUMED_FEE_RATE) - price;
        const expectedMargin = expectedSalePrice > 0 ? (expectedProfit / expectedSalePrice) * 100 : 0;
        const maxPurchasePrice = Math.max(0, expectedSalePrice * (1 - ASSUMED_FEE_RATE - TARGET_MARGIN));
        const averageDaysToSell = similarSales.length > 0
            ? average(similarSales.map((sale) => sale.daysToSell))
            : null;
        const score = clamp(Math.round(50 + expectedMargin), 0, 100);
        const recommendation = score >= 70 ? 'BUY' : score >= 40 ? 'CONSIDER' : 'AVOID';
        const reason = similarSales.length > 0
            ? `Basierend auf ${similarSales.length} ähnlichen Verkäufen: erwartete Marge ${expectedMargin.toFixed(0)}%.`
            : `Keine vergleichbaren Verkäufe vorhanden — Schätzung auf Basis eines pauschalen Wiederverkaufsfaktors (${FALLBACK_RESALE_MULTIPLIER}x).`;
        return {
            score,
            expectedSalePrice: round2(expectedSalePrice),
            expectedProfit: round2(expectedProfit),
            expectedMargin: round2(expectedMargin),
            averageDaysToSell: averageDaysToSell === null ? null : Math.round(averageDaysToSell),
            maxPurchasePrice: round2(maxPurchasePrice),
            similarSalesCount: similarSales.length,
            recommendation,
            reason,
        };
    }
};
exports.ListingScoringService = ListingScoringService;
exports.ListingScoringService = ListingScoringService = __decorate([
    (0, common_1.Injectable)()
], ListingScoringService);
function average(values) {
    return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
}
function round2(value) {
    return Math.round(value * 100) / 100;
}
//# sourceMappingURL=listing-scoring.service.js.map