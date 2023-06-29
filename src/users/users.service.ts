import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, ILike, Repository } from 'typeorm';
import { User } from './user.entity';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import {
  CreateUserResponse, DeleteUserResponse,
  FindAllUsersResponse,
  FindOneUserByEmailResponse,
  FindOneUserResponse
} from '../interfaces/user.interface';
import {UserFriends} from '../user-friends/user-friend.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserFriends)
    private userFriendsRepository: Repository<UserFriends>,
    private readonly jwtService: JwtService,
  ) {}

  async findAll(): Promise<FindAllUsersResponse> {
    const users = await this.userRepository.find();
    return { users };
  }

  async findOne(id: number): Promise<FindOneUserResponse> {
    const user = await this.userRepository.findOne({where:{id}});
    return { user };
  }

  async findOneByEmail(email: string): Promise<FindOneUserByEmailResponse> {
    const user = await this.userRepository.findOne({ where: { email } });
    return { user };
  }

  async create(user: DeepPartial<User>): Promise<CreateUserResponse> {
    const existUserByEmail = await this.userRepository.findOne({ where: { email: user.email } });
    if (existUserByEmail) throw new BadRequestException('User with this email already exists');

    const existUserByTag = await this.userRepository.findOne({ where: { tag: user.tag } });
    if (existUserByTag) throw new BadRequestException('User with this tag already exists');

    const hashedPassword = await argon2.hash(user.password);
    const userInfo = await this.userRepository.save({ ...user, password: hashedPassword });
    const token = this.jwtService.sign({ email: user.email, id: userInfo.id });
    delete userInfo.password;

    return { userInfo, token };
  }

  async update(id: number, userData: DeepPartial<User>): Promise<User> {
    await this.userRepository.update(id, userData);
    const updatedUser = await this.userRepository.findOne({where: {id}});
    delete updatedUser.password;
    return updatedUser;
  }

  async delete(id: number): Promise<DeleteUserResponse> {
    await this.userRepository.delete(id);
    return { success: true };
  }

  async searchFriendByTag(search: string, id: number, pagination): Promise<any> {
    const {page, size} = pagination;
    const [users, count] = await this.userRepository.findAndCount({ where: { tag: ILike(`%${search}%`) },
      skip: (page - 1) * size,
      take: size,});
    let results = [];
    for (let user of users) {
      let userFriend = await this.userFriendsRepository.findOne({
        where: [{userId: id, friendId: user.id},{friendId: id, userId: user.id}],
      })
      delete user.password;
      results.push({...user, isFriend: !!userFriend})
    }
    return {users: results, count};
  }
}
