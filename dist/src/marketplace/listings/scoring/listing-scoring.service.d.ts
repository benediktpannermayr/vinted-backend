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
export declare class ListingScoringService {
    score({ price, similarSales }: ListingScoreInput): ListingScoreResult;
}
