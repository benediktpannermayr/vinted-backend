import { Injectable } from '@nestjs/common';

// Heuristic-based scoring. Deliberately simple and self-contained (no DB
// access here) so it stays easy to unit test and easy to swap for a
// data-driven or LLM-backed implementation later without touching callers.
const ASSUMED_FEE_RATE = 0.15; // marketplace + shipping fees as a share of sale price
const TARGET_MARGIN = 0.3; // margin used to compute the recommended max purchase price
const FALLBACK_RESALE_MULTIPLIER = 1.6; // used only when there is no sales history to learn from

export interface SimilarSale {
  soldPrice: number;
  purchasePrice: number;
  daysToSell: number;
}

export interface ListingScoreInput {
  price: number;
  similarSales: SimilarSale[];
}

export interface ListingScoreResult {
  score: number;
  expectedSalePrice: number;
  expectedProfit: number;
  expectedMargin: number;
  averageDaysToSell: number | null;
  maxPurchasePrice: number;
  similarSalesCount: number;
  recommendation: 'BUY' | 'CONSIDER' | 'AVOID';
  reason: string;
}

@Injectable()
export class ListingScoringService {
  score({ price, similarSales }: ListingScoreInput): ListingScoreResult {
    const expectedSalePrice =
      similarSales.length > 0
        ? average(similarSales.map((sale) => sale.soldPrice))
        : price * FALLBACK_RESALE_MULTIPLIER;

    const expectedProfit = expectedSalePrice * (1 - ASSUMED_FEE_RATE) - price;
    const expectedMargin =
      expectedSalePrice > 0 ? (expectedProfit / expectedSalePrice) * 100 : 0;
    const maxPurchasePrice = Math.max(
      0,
      expectedSalePrice * (1 - ASSUMED_FEE_RATE - TARGET_MARGIN),
    );

    const averageDaysToSell =
      similarSales.length > 0
        ? average(similarSales.map((sale) => sale.daysToSell))
        : null;

    const score = clamp(Math.round(50 + expectedMargin), 0, 100);

    const recommendation: ListingScoreResult['recommendation'] =
      score >= 70 ? 'BUY' : score >= 40 ? 'CONSIDER' : 'AVOID';

    const reason =
      similarSales.length > 0
        ? `Basierend auf ${similarSales.length} ähnlichen Verkäufen: erwartete Marge ${expectedMargin.toFixed(0)}%.`
        : `Keine vergleichbaren Verkäufe vorhanden — Schätzung auf Basis eines pauschalen Wiederverkaufsfaktors (${FALLBACK_RESALE_MULTIPLIER}x).`;

    return {
      score,
      expectedSalePrice: round2(expectedSalePrice),
      expectedProfit: round2(expectedProfit),
      expectedMargin: round2(expectedMargin),
      averageDaysToSell:
        averageDaysToSell === null ? null : Math.round(averageDaysToSell),
      maxPurchasePrice: round2(maxPurchasePrice),
      similarSalesCount: similarSales.length,
      recommendation,
      reason,
    };
  }
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
