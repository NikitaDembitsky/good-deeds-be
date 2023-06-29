import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import {UsersModule} from '../users/users.module';
import {LocalStrategy} from './strategies/local.strategy';
import {PassportModule} from '@nestjs/passport';
import { AuthController } from './auth.controller';
import {JwtModule} from '@nestjs/jwt';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {JwtStrategy} from './strategies/jwt.strategy';

@Module({
  imports: [UsersModule, PassportModule,
  JwtModule.registerAsync({
    imports: [ConfigModule],
    useFactory: (configService: ConfigService) => ({
      secret: configService.get('JWT_SECRET'),
      signOptions: {expiresIn: '8h'}
    }),
    inject: [ConfigService]
  })],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  controllers: [AuthController]
})
export class AuthModule {}
