import {GoodDeed} from '../good-deeds/good-deed.entity';

export interface FindAllByUserIdResponse {
  items: GoodDeed[];
  count: number;
}

export interface CreateResponse {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface DeleteResponse {
  success: boolean;
  id: number;
}

export interface UpdateResponse {
  id: number;
  title: string;
  description: string;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}
