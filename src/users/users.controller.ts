import {Controller, Get, Post, Body, Put, Param, Delete, NotFoundException, UseGuards, Query} from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';
import {JwtAuthGuard} from '../auth/guards/jwt-auth.guard';
import {CurrentUser} from '../decorator/current-user.decorator';
import {
  CreateUserResponse, DeleteUserResponse,
  FindAllUsersResponse,
  FindOneUserResponse,
} from '../interfaces/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<FindAllUsersResponse> {
    return this.usersService.findAll();
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchFriendByTag(@CurrentUser() user, @Query() query: {q: string, size: number, page: number}): Promise<User[]> {
    const size = query?.size ?? 10;
    const page = query?.page ?? 1;
    return await this.usersService.searchFriendByTag(query.q, user.id, {page, size});
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findOne(@CurrentUser() user): Promise<FindOneUserResponse> {
    const userById = await this.usersService.findOne(user.id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    } else {
      delete userById.user.password
      return userById;
    }
  }

  //create user
  @Post('register')
  async create(@Body() user: User): Promise<CreateUserResponse> {
    return this.usersService.create(user);
  }

  //update user
  @UseGuards(JwtAuthGuard)
  @Put()
  async update (@CurrentUser() userData, @Body() user: User): Promise<User> {
    return this.usersService.update(userData.id, user);
  }

  //delete user
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: number): Promise<DeleteUserResponse> {
    //handle error if user does not exist
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User does not exist!');
    }
    return this.usersService.delete(id);
  }
}
