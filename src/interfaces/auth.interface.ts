import {User} from '../users/user.entity';

export interface ValidateUserResponse {
  user: User;
}

export interface LoginResponse {
  id: number;
  email: string;
  access_token: string;
}
