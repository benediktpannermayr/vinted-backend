import { Controller, Get } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  getStats(@CurrentUser() user: AuthenticatedUser) {
    return this.dashboardService.getStats(user.id);
  }
}
