import { Module } from '@nestjs/common';
import { ItemsModule } from '../items/items.module';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
  imports: [ItemsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
