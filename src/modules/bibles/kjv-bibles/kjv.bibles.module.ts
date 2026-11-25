import { Module } from "@nestjs/common";
import { KjvBiblesService } from "./kjv.bibles.service";
import { KjvBiblesController } from "./kjv.bibles.controller";

@Module({
  providers: [KjvBiblesService],
  controllers: [KjvBiblesController],
  exports: [KjvBiblesService],
})
export class KjvBiblesModule {}
