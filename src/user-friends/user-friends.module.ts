import { Module } from '@nestjs/common';
import { UserFriendsController } from './user-friends.controller';
import { UserFriendsService } from './user-friends.service';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserFriends} from './user-friend.entity';
import {User} from '../users/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserFriends, User])],
  controllers: [UserFriendsController],
  providers: [UserFriendsService]
})
export class UserFriendsModule {}
