import { Controller, Get, Param } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { KjvBiblesService } from "./kjv.bibles.service";

@ApiTags("Bibles")
@Controller("kjv")
export class KjvBiblesController {
  constructor(private readonly service: KjvBiblesService) {}

  @Get("/")
  async getVerse() {
    const verse = await this.service.getVerse();
    return {
      message: "Verse fetched successfully",
      data: verse,
    };
  }

  @Get(":bookId/:chapter")
  async getBookWithChapter(
    @Param("bookId") bookId: string,
    @Param("chapter") chapter: string,
  ) {
    const verse = await this.service.getBookWithChapter(bookId, chapter);
    return {
      message: "Fetch Book Successfully",
      data: verse,
    };
  }
}
