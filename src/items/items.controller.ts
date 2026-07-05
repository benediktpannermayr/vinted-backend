import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { AuthenticatedUser } from '../auth/interfaces/authenticated-user.interface';
import { BulkUpdateItemsDto } from './dto/bulk-update-items.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { ImportPreviewDto } from './dto/import-preview.dto';
import { QueryItemsDto } from './dto/query-items.dto';
import { SellItemDto } from './dto/sell-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { RemoveImageDto } from './dto/remove-image.dto';
import { ImportListingPreviewService } from './import-listing-preview.service';
import { ItemsService } from './items.service';

@ApiTags('items')
@ApiBearerAuth()
@Controller('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly importListingPreviewService: ImportListingPreviewService,
  ) {}

  @Get()
  findAll(
    @CurrentUser() user: AuthenticatedUser,
    @Query() query: QueryItemsDto,
  ) {
    return this.itemsService.findAll(user.id, query);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateItemDto) {
    return this.itemsService.create(user.id, dto);
  }

  @Post('import-preview')
  importPreview(@Body() dto: ImportPreviewDto) {
    return this.importListingPreviewService.preview(dto.listingUrl);
  }

  @Patch('bulk-update')
  bulkUpdate(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: BulkUpdateItemsDto,
  ) {
    return this.itemsService.bulkUpdateStatus(user.id, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.itemsService.findOne(id, user.id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: UpdateItemDto,
  ) {
    return this.itemsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @CurrentUser() user: AuthenticatedUser) {
    return this.itemsService.remove(id, user.id);
  }

  @Post(':id/sell')
  sell(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: SellItemDto,
  ) {
    return this.itemsService.sell(id, user.id, dto);
  }

  @Post(':id/images')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  addImage(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: /^image\/(jpeg|png|webp)$/ })
        .addMaxSizeValidator({ maxSize: 5 * 1024 * 1024 })
        .build({ fileIsRequired: true }),
    )
    file: Express.Multer.File,
  ) {
    return this.itemsService.addImage(id, user.id, file);
  }

  @Delete(':id/images')
  removeImage(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RemoveImageDto,
  ) {
    return this.itemsService.removeImage(id, user.id, dto.imageUrl);
  }
}
