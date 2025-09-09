import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { BibleModule } from './modules/bibles/bibles.module';
import { TopicsModule } from './modules/topics/topics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailerModule,
    BibleModule,
    TopicsModule
  ],
})
export class AppModule {}
