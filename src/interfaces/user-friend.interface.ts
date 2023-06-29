import {User} from '../users/user.entity';

export interface GetAllFriendsResponse {
  id: number;
  user: User;
  friend: User;
}

export interface AddFriendResponse {
  success: boolean;
  user: User
}
