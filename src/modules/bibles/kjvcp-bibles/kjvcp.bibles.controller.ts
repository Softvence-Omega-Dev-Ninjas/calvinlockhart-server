import { Controller, Get, Param } from "@nestjs/common";
import { KjvcpBiblesService } from "./kjvcp.service";

@Controller("kjvcp")
export class KjvcpBiblesController {
  constructor(private readonly service: KjvcpBiblesService) {}

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
