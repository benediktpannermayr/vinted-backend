import { ListingScoringService } from './listing-scoring.service';

describe('ListingScoringService', () => {
  let service: ListingScoringService;

  beforeEach(() => {
    service = new ListingScoringService();
  });

  it('falls back to a heuristic resale multiplier when there is no sales history', () => {
    const result = service.score({ price: 10, similarSales: [] });

    expect(result.expectedSalePrice).toBeCloseTo(16, 5);
    expect(result.similarSalesCount).toBe(0);
    expect(result.averageDaysToSell).toBeNull();
    expect(result.reason).toMatch(/keine vergleichbaren verkäufe/i);
  });

  it('uses the average of similar past sales when available', () => {
    const result = service.score({
      price: 10,
      similarSales: [
        { soldPrice: 20, purchasePrice: 8, daysToSell: 10 },
        { soldPrice: 30, purchasePrice: 12, daysToSell: 20 },
      ],
    });

    expect(result.expectedSalePrice).toBeCloseTo(25, 5);
    expect(result.similarSalesCount).toBe(2);
    expect(result.averageDaysToSell).toBe(15);
  });

  it('recommends BUY for a clearly profitable listing', () => {
    const result = service.score({
      price: 5,
      similarSales: [{ soldPrice: 40, purchasePrice: 5, daysToSell: 5 }],
    });

    expect(result.recommendation).toBe('BUY');
    expect(result.score).toBeGreaterThanOrEqual(70);
  });

  it('recommends AVOID when the listing price exceeds the expected sale price', () => {
    const result = service.score({
      price: 50,
      similarSales: [{ soldPrice: 20, purchasePrice: 8, daysToSell: 10 }],
    });

    expect(result.recommendation).toBe('AVOID');
    expect(result.expectedProfit).toBeLessThan(0);
  });

  it('keeps the score within the 0-100 bounds for extreme inputs', () => {
    const veryProfitable = service.score({
      price: 1,
      similarSales: [{ soldPrice: 1000, purchasePrice: 1, daysToSell: 1 }],
    });
    const veryUnprofitable = service.score({
      price: 1000,
      similarSales: [{ soldPrice: 5, purchasePrice: 2, daysToSell: 1 }],
    });

    expect(veryProfitable.score).toBeLessThanOrEqual(100);
    expect(veryUnprofitable.score).toBeGreaterThanOrEqual(0);
  });

  it('computes a max purchase price below the expected sale price', () => {
    const result = service.score({
      price: 10,
      similarSales: [{ soldPrice: 40, purchasePrice: 10, daysToSell: 5 }],
    });

    expect(result.maxPurchasePrice).toBeLessThan(result.expectedSalePrice);
    expect(result.maxPurchasePrice).toBeGreaterThanOrEqual(0);
  });
});
