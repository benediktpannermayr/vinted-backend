import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(user: AuthenticatedUser): Promise<import("./dto/dashboard-stats-response.dto").DashboardStatsResponseDto>;
}
