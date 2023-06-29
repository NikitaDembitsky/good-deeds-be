import {BadRequestException, Injectable} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt'
import {LoginResponse} from '../interfaces/auth.interface';
import {FindOneUserByEmailResponse} from '../interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<FindOneUserByEmailResponse> {
    const userData = await this.usersService.findOneByEmail(email);
    const isPasswordMatch = password && userData?.user && (await argon2.verify(userData?.user?.password, password.toString()));
    if (userData && isPasswordMatch) {
      return userData;
    }
    throw new BadRequestException('Incorrect password or user data');
  }

  async login({user}): Promise<LoginResponse> {
    const {id, email} = user;
    if (!user) throw new BadRequestException('Incorrect login or password')
    return {
      id, email,
      access_token: this.jwtService.sign({id, email}),
    };
  }
}
