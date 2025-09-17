import { Module } from "@nestjs/common";
import { KjvaBiblesService } from "./kjva.bibles.service";
import { KjvaBiblesController } from "./kjva.bibles.controller";

@Module({
  providers: [KjvaBiblesService],
  controllers: [KjvaBiblesController],
  exports: [KjvaBiblesService]
})
export class KjvaBiblesModule { }