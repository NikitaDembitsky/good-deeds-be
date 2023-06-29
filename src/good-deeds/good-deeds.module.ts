import { Module } from '@nestjs/common';
import { GoodDeedsController } from './good-deeds.controller';
import { GoodDeedsService } from './good-deeds.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {GoodDeed} from './good-deed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([GoodDeed])],
  controllers: [GoodDeedsController],
  providers: [GoodDeedsService]
})
export class GoodDeedsModule {}
