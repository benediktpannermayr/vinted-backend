import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../../auth/interfaces/authenticated-user.interface';
import { CreateSearchProfileDto } from './dto/create-search-profile.dto';
import { UpdateSearchProfileDto } from './dto/update-search-profile.dto';
import { SearchProfilesService } from './search-profiles.service';
import { MarketplaceSyncService } from '../marketplace-sync.service';

@ApiTags('marketplace')
@ApiBearerAuth()
@Controller('marketplace/search-profiles')
export class SearchProfilesController {
  constructor(
    private readonly searchProfilesService: SearchProfilesService,
    private readonly marketplaceSyncService: MarketplaceSyncService,
  ) {}

  @Get()
  findAll(@CurrentUser() user: AuthenticatedUser) {
    return this.searchProfilesService.findAll(user.id);
  }

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateSearchProfileDto,
  ) {
    return this.searchProfilesService.create(user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.searchProfilesService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateSearchProfileDto,
  ) {
    return this.searchProfilesService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.searchProfilesService.remove(id, user.id);
  }

  @Post(':id/run')
  runNow(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.marketplaceSyncService.runNow(id, user.id);
  }
}
