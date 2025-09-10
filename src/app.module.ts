import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { ConfigModule } from '@nestjs/config';
import { TopicsModule } from './modules/topics/topics.module';
import { BiblesGroupModule } from './modules/bibles/bibles.group.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailerModule,
    BiblesGroupModule,
    TopicsModule
  ],
})
export class AppModule {}
