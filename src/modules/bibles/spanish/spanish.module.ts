import { Module } from "@nestjs/common";
import { SpanishController } from "./spanish.controller";
import { SpanishService } from "./spanish.service";

@Module({
  providers: [SpanishService],
  controllers: [SpanishController],
})
export class SpanishModule {}
