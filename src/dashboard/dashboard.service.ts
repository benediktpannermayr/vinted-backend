import { Inject, Injectable } from '@nestjs/common';
import {
  ITEM_REPOSITORY,
  type IItemRepository,
} from '../items/repositories/item.repository.interface';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';

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

interface MonthBound {
  label: string;
  from: Date;
  to: Date;
}

/** Month boundaries use server-local time via `Date`, consistent with existing date handling in this codebase (see item-response.dto.ts). */
function getLastMonthBounds(now: Date, count: number): MonthBound[] {
  const bounds: MonthBound[] = [];
  for (let i = count - 1; i >= 0; i--) {
    const from = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const to = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    bounds.push({ label: MONTHS_DE[from.getMonth()], from, to });
  }
  return bounds;
}

@Injectable()
export class DashboardService {
  constructor(
    @Inject(ITEM_REPOSITORY) private readonly itemRepository: IItemRepository,
  ) {}

  async getStats(userId: string): Promise<DashboardStatsResponseDto> {
    const monthBounds = getLastMonthBounds(new Date(), CHART_MONTHS);

    const [monthlyAggregates, stock] = await Promise.all([
      Promise.all(
        monthBounds.map(({ from, to }) =>
          this.itemRepository.aggregateSold(userId, from, to),
        ),
      ),
      this.itemRepository.aggregateStock(userId),
    ]);

    const currentMonth = monthlyAggregates[monthlyAggregates.length - 1];
    const monthlyRevenue = currentMonth.soldPriceSum;
    const monthlyProfit =
      currentMonth.soldPriceSum -
      currentMonth.saleShippingSum -
      currentMonth.saleFeesSum -
      currentMonth.purchasePriceSum -
      currentMonth.purchaseShippingSum -
      currentMonth.purchaseFeesSum;
    const stockValue =
      stock.purchasePriceSum + stock.purchaseShippingSum + stock.purchaseFeesSum;

    return new DashboardStatsResponseDto({
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
}
