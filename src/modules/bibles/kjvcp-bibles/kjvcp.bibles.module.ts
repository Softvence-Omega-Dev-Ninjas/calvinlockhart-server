import { Module } from "@nestjs/common";
import { KjvcpBiblesService } from "./kjvcp.service";
import { KjvcpBiblesController } from "./kjvcp.bibles.controller";


@Module({
  providers: [KjvcpBiblesService],
  controllers: [KjvcpBiblesController],
})
export class KjvcpBiblesModule {}