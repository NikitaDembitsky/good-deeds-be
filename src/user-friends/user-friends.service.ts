import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {UserFriends} from './user-friend.entity';
import {Repository} from 'typeorm';
import {User} from '../users/user.entity';
import {AddFriendResponse} from '../interfaces/user-friend.interface';

@Injectable()
export class UserFriendsService {
  constructor(
    @InjectRepository(UserFriends)
    private userFriendsRepository: Repository<UserFriends>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getAllFriends(id): Promise<any[]>  {
    const friends = await this.userFriendsRepository.find({
      where: [{friendId: id}, {userId: id}],
      relations: ['user', 'friend']
    })
    return friends.map((item:any) => {
      item.friend.isFriend = true;
      item.user.isFriend = true;
      if (item?.userId === id) {
        delete item.friend.password;
        return item.friend
      }
      delete item.user.password;
      return item.user;
    });
  }

  async getFriendsGoodDeeds(id): Promise<any[]>  {
    const friends = await this.userFriendsRepository.find({
      where: [{friendId: id}, {userId: id}],
      relations: ['user.goodDeeds', 'friend.goodDeeds']
    })
    return friends.map((item: any) => {
      item.friend.isFriend = true;
      item.user.isFriend = true;
      delete item.user.password
      delete item.friend.password
      if (item?.userId === id) {
        return item.friend
      }
      return item.user;
    });
  }



  async addFriend(data): Promise<AddFriendResponse> {
    const { userId, friendId } = data;
    const isUsersExists = await this.usersRepository.find({
      where: [{ id: userId }, { id: friendId }],
    });
    if (isUsersExists.length < 2) throw new NotFoundException();
    const isItemAlreadyExist = await this.userFriendsRepository.findOne({
      where: { userId, friendId },
    });
    if (isItemAlreadyExist)
      throw new BadRequestException('The user is already a friend');

    let userFriendItem = await this.userFriendsRepository.create({
      userId,
      friendId,
    });
    const friendInfo = await this.usersRepository.findOne({
      where: {id: friendId}
    })
    delete friendInfo.password;

    await this.userFriendsRepository.save(userFriendItem);

    return { success: true,  user: friendInfo};
  }

  async deleteFriend(data) {
    const { userId, friendId } = data;
    const isUsersExists = await this.usersRepository.find({
      where: [{ id: userId }, { id: friendId }],
    });
    if (isUsersExists.length < 2) throw new NotFoundException();
    const itemForDelete = await this.userFriendsRepository.findOne({
      where: [{ userId, friendId }, {friendId: userId, userId: friendId}]
    })
    await this.userFriendsRepository.delete(itemForDelete.id)

    return {success: true, friendId}
  }
}
