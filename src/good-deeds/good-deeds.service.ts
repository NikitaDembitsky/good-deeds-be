import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodDeed } from './good-deed.entity';
import { Repository } from 'typeorm';
import {
  CreateResponse,
  DeleteResponse,
  FindAllByUserIdResponse,
  UpdateResponse,
} from '../interfaces/good-deed.interface';

@Injectable()
export class GoodDeedsService {
  constructor(
    @InjectRepository(GoodDeed)
    private readonly goodDeedRepository: Repository<GoodDeed>,
  ) {}

  async findAllByUserId(data: {
    userId: number;
    size: number;
    page: number;
  }): Promise<FindAllByUserIdResponse> {
    const { userId, size, page } = data;
    const [items, count] = await this.goodDeedRepository.findAndCount({
      where: { userId },
      skip: (page - 1) * size,
      take: size,
    });
    return { items, count };
  }

  async create(data: {
    title: string;
    description: string;
    userId: number;
  }): Promise<CreateResponse> {
    const { title, description, userId } = data;
    const goodDeed = await this.goodDeedRepository.create({
      title,
      description,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.goodDeedRepository.save(goodDeed);
    return goodDeed;
  }

  async delete(data: { id: number; userId: number }): Promise<DeleteResponse> {
    const { id, userId } = data;
    const itemForDelete = await this.goodDeedRepository.findOne({
      where: { id, userId },
    });
    if (!itemForDelete) {
      throw new BadRequestException('Good deed not found');
    }

    await this.goodDeedRepository.delete({ id, userId });

    return { success: true, id };
  }

  async update(data: {
    id: number;
    userId: number;
    body: { title?: string; description?: string };
  }): Promise<UpdateResponse> {
    const { id, userId, body } = data;
    const itemForUpdate = await this.goodDeedRepository.findOne({
      where: { id, userId },
    });

    if (!itemForUpdate) {
      throw new BadRequestException('Good deed not found');
    }

    await this.goodDeedRepository.update({ id, userId }, { ...body, updatedAt: new Date() });
    return await this.goodDeedRepository.findOne({ where: { id } });
  }
}
