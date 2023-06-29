import {User} from '../users/user.entity';

export interface FindAllUsersResponse {
  users: User[];
}

export interface FindOneUserResponse {
  user: User;
}

export interface FindOneUserByEmailResponse {
  user?: User;
}

export interface CreateUserResponse {
  userInfo: User;
  token: string;
}

export interface DeleteUserResponse {
  success: boolean;
}

// export interface SearchFriendByTagResponse {
//   users: User[];
// }
