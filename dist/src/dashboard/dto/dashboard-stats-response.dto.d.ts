export declare class MonthlyRevenuePointDto {
    month: string;
    revenue: number;
}
export declare class DashboardStatsResponseDto {
    monthlyRevenue: number;
    monthlyProfit: number;
    stockValue: number;
    itemsInStock: number;
    chart: MonthlyRevenuePointDto[];
    constructor(data: {
        monthlyRevenue: number;
        monthlyProfit: number;
        stockValue: number;
        itemsInStock: number;
        chart: MonthlyRevenuePointDto[];
    });
}
