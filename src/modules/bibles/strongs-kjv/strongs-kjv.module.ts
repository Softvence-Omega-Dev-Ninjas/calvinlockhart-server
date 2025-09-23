import { Module } from "@nestjs/common";
import { StrongsKJVService } from "./strongs-kjv.service";
import { StrongsKJVController } from "./strongs-kjv.controller";


@Module({
  providers: [StrongsKJVService],
  controllers: [StrongsKJVController],
})
export class StrongsKJVModule {}