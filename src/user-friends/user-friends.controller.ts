import {Controller, Delete, Get, Param, Post, UseGuards} from '@nestjs/common';
import {UserFriendsService} from './user-friends.service';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CurrentUser} from '../decorator/current-user.decorator';

@Controller('user-friends')
@UseGuards(JwtAuthGuard)
export class UserFriendsController {
  constructor(private readonly userFriendsService: UserFriendsService) {}

  @Get()
  async getAllFriends(@CurrentUser() user) {
    try {
      return await this.userFriendsService.getAllFriends(user.id);
    } catch (error) {
      throw error;
    }
  }

  @Get('/good-deeds')
  async getFriendsGoodDeeds(@CurrentUser() user) {
    try {
      return await this.userFriendsService.getFriendsGoodDeeds(user.id);
    } catch (e) {
      throw e;
    }
  }

  @Post(':friendId')
  async addFriend(@CurrentUser() user, @Param('friendId') friendId: number) {
    try {
      return await this.userFriendsService.addFriend({userId: user.id, friendId});
    } catch (error) {
      throw error;
    }
  }

  @Delete(':friendId')
  async deleteFriend(@CurrentUser() user, @Param('friendId') friendId: number) {
    try {
      return await this.userFriendsService.deleteFriend({userId: user.id, friendId});
    } catch (error) {
      throw error;
    }
  }
}
