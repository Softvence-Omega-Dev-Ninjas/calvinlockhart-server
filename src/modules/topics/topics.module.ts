import { Module } from "@nestjs/common";
import { TopicsController } from "./topics.controller";
import { TopicsService } from "./topics.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [TopicsController],
  providers: [TopicsService],
  imports: [AuthModule],
})
export class TopicsModule {}
