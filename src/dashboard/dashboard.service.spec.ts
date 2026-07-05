import type {
  ItemSoldAggregate,
  ItemStockAggregate,
} from '../items/repositories/item.repository.interface';
import { DashboardService } from './dashboard.service';

function buildSoldAggregate(overrides: Partial<ItemSoldAggregate> = {}): ItemSoldAggregate {
  return {
    soldPriceSum: 0,
    saleShippingSum: 0,
    saleFeesSum: 0,
    purchasePriceSum: 0,
    purchaseShippingSum: 0,
    purchaseFeesSum: 0,
    ...overrides,
  };
}

function buildStockAggregate(overrides: Partial<ItemStockAggregate> = {}): ItemStockAggregate {
  return {
    purchasePriceSum: 0,
    purchaseShippingSum: 0,
    purchaseFeesSum: 0,
    count: 0,
    ...overrides,
  };
}

describe('DashboardService', () => {
  let service: DashboardService;
  let itemRepository: { aggregateSold: jest.Mock; aggregateStock: jest.Mock };

  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2026-07-05'));
    itemRepository = {
      aggregateSold: jest.fn().mockResolvedValue(buildSoldAggregate()),
      aggregateStock: jest.fn().mockResolvedValue(buildStockAggregate()),
    };
    service = new DashboardService(itemRepository as never);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('queries the last 6 calendar months, oldest first, ending on the current month', async () => {
    await service.getStats('user-1');

    expect(itemRepository.aggregateSold).toHaveBeenCalledTimes(6);
    const expectedMonths = [
      [2026, 1], // Feb
      [2026, 2], // Mär
      [2026, 3], // Apr
      [2026, 4], // Mai
      [2026, 5], // Jun
      [2026, 6], // Jul
    ];
    expectedMonths.forEach(([year, month], index) => {
      const [, from, to] = itemRepository.aggregateSold.mock.calls[index] as [
        string,
        Date,
        Date,
      ];
      expect(from).toEqual(new Date(year, month, 1));
      expect(to).toEqual(new Date(year, month + 1, 1));
    });
  });

  it('computes monthlyRevenue/monthlyProfit from the current month aggregate', async () => {
    itemRepository.aggregateSold.mockImplementation((_userId, from: Date) => {
      const isCurrentMonth = from.getMonth() === 6 && from.getFullYear() === 2026;
      return Promise.resolve(
        isCurrentMonth
          ? buildSoldAggregate({
              soldPriceSum: 100,
              saleShippingSum: 5,
              saleFeesSum: 3,
              purchasePriceSum: 40,
              purchaseShippingSum: 2,
              purchaseFeesSum: 1,
            })
          : buildSoldAggregate(),
      );
    });

    const result = await service.getStats('user-1');

    expect(result.monthlyRevenue).toBe(100);
    expect(result.monthlyProfit).toBe(100 - 5 - 3 - 40 - 2 - 1);
  });

  it('allows negative profit when costs exceed the sale', async () => {
    itemRepository.aggregateSold.mockResolvedValue(
      buildSoldAggregate({ soldPriceSum: 10, purchasePriceSum: 50 }),
    );

    const result = await service.getStats('user-1');

    expect(result.monthlyProfit).toBe(10 - 50);
  });

  it('computes stockValue as the sum of the purchase-side columns', async () => {
    itemRepository.aggregateStock.mockResolvedValue(
      buildStockAggregate({
        purchasePriceSum: 20,
        purchaseShippingSum: 3,
        purchaseFeesSum: 2,
        count: 4,
      }),
    );

    const result = await service.getStats('user-1');

    expect(result.stockValue).toBe(25);
    expect(result.itemsInStock).toBe(4);
  });

  it('returns a 6-entry chart, oldest to newest, with correct German month labels', async () => {
    const result = await service.getStats('user-1');

    expect(result.chart.map((point) => point.month)).toEqual([
      'Feb',
      'Mär',
      'Apr',
      'Mai',
      'Jun',
      'Jul',
    ]);
  });

  it('resolves to an all-zero DTO when there are no items', async () => {
    const result = await service.getStats('user-1');

    expect(result.monthlyRevenue).toBe(0);
    expect(result.monthlyProfit).toBe(0);
    expect(result.stockValue).toBe(0);
    expect(result.itemsInStock).toBe(0);
    expect(result.chart).toHaveLength(6);
    expect(result.chart.every((point) => point.revenue === 0)).toBe(true);
  });
});
