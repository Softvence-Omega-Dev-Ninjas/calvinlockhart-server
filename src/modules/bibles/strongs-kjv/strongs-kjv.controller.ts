import { Controller, Get, Param, Query, ParseIntPipe } from "@nestjs/common";
import { StrongsEntryResponse, StrongsKJVService } from "./strongs-kjv.service";

@Controller("strongs-kjv")
export class StrongsKJVController {
  constructor(private readonly service: StrongsKJVService) {}

  @Get()
  getAll(
    @Query("page", new ParseIntPipe({ optional: true })) page = 1,
    @Query("limit", new ParseIntPipe({ optional: true })) limit = 100,
  ): StrongsEntryResponse[] {
    return this.service.findAll(page, limit);
  }

  // GET /strongs-kjv/:id
  @Get(":id")
  getById(@Param("id") id: string) {
    return this.service.findById(id);
  }
}
