import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {GoodDeedsService} from './good-deeds.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CurrentUser} from '../decorator/current-user.decorator';
import {FindAllByUserIdDto} from './dto/find-all-by-user.dto';
import {CreateGoodDeedDto} from './dto/create.dto';
import {UpdateGoodDeedDto} from './dto/update.dto';

@Controller('good-deeds')
@UseGuards(JwtAuthGuard)
export class GoodDeedsController {
  constructor(private readonly goodDeedsService: GoodDeedsService) {}

  @Get()
  async findAllByUserId(@CurrentUser() user, @Query() query: FindAllByUserIdDto) {
    try {
      const size = query?.size ?? 10;
      const page = query?.page ?? 1;
      return await this.goodDeedsService.findAllByUserId({userId: user.id, size, page});
    } catch (error) {
      throw error;
    }
  }

  @Post()
  async create(@CurrentUser() user, @Body() body: CreateGoodDeedDto) {
    try {
      return await this.goodDeedsService.create({userId: user.id, ...body});
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  async delete(@CurrentUser() user, @Param('id') id: number) {
    try {
      return await this.goodDeedsService.delete({userId: user.id, id});
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  async update(@CurrentUser() user, @Param('id') id: number, @Body() body: UpdateGoodDeedDto) {
    try {
      return await this.goodDeedsService.update({userId: user.id, id, body});
    } catch (error) {
      throw error;
    }
  }
}
