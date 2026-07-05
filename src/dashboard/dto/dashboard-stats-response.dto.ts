import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';

@Exclude()
export class MonthlyRevenuePointDto {
  @Expose() @ApiProperty({ description: 'Monat, z. B. "Jul"' }) month: string;
  @Expose() @ApiProperty() revenue: number;
}

@Exclude()
export class DashboardStatsResponseDto {
  @Expose()
  @ApiProperty({ description: 'Umsatz im aktuellen Kalendermonat (EUR)' })
  monthlyRevenue: number;

  @Expose()
  @ApiProperty({ description: 'Gewinn im aktuellen Kalendermonat (EUR)' })
  monthlyProfit: number;

  @Expose()
  @ApiProperty({
    description:
      'Lagerwert: Summe Einkaufspreis+Versand+Gebühren für nicht verkaufte Artikel (EUR)',
  })
  stockValue: number;

  @Expose()
  @ApiProperty({ description: 'Anzahl Artikel im Lager (Status != SOLD)' })
  itemsInStock: number;

  @Expose()
  @ApiProperty({
    type: [MonthlyRevenuePointDto],
    description: 'Umsatz je Monat, letzte 6 Kalendermonate, älteste zuerst',
  })
  @Type(() => MonthlyRevenuePointDto)
  chart: MonthlyRevenuePointDto[];

  constructor(data: {
    monthlyRevenue: number;
    monthlyProfit: number;
    stockValue: number;
    itemsInStock: number;
    chart: MonthlyRevenuePointDto[];
  }) {
    this.monthlyRevenue = round2(data.monthlyRevenue);
    this.monthlyProfit = round2(data.monthlyProfit);
    this.stockValue = round2(data.stockValue);
    this.itemsInStock = data.itemsInStock;
    this.chart = data.chart.map((point) => ({
      month: point.month,
      revenue: round2(point.revenue),
    }));
  }
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
