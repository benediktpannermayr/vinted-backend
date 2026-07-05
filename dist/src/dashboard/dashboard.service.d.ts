import { type IItemRepository } from '../items/repositories/item.repository.interface';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
export declare class DashboardService {
    private readonly itemRepository;
    constructor(itemRepository: IItemRepository);
    getStats(userId: string): Promise<DashboardStatsResponseDto>;
}
