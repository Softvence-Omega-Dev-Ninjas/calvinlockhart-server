import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { MailerModule } from '../mailer/mailer.module';
import { JwtStrategy } from './jwt.strategy';
import { TokenService } from './token.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';


@Module({
  imports: [
    UsersModule,
    MailerModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRES_IN') || '3600s' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, TokenService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}