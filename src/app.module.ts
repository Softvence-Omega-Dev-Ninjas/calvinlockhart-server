import { Module } from "@nestjs/common";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { UsersModule } from "./modules/users/users.module";
import { AuthModule } from "./modules/auth/auth.module";
import { MailerModule } from "./modules/mailer/mailer.module";
import { ConfigModule } from "@nestjs/config";
import { TopicsModule } from "./modules/topics/topics.module";
import { BiblesGroupModule } from "./modules/bibles/bibles.group.module";
import { NotesModule } from "./modules/note/note.module";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute per IP
      },
    ]),
    PrismaModule,
    UsersModule,
    AuthModule,
    MailerModule,
    BiblesGroupModule,
    TopicsModule,
    NotesModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
