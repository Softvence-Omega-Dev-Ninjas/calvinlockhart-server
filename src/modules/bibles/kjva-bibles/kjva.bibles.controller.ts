import { Controller, Get, Param } from "@nestjs/common";
import { KjvaBiblesService } from "./kjva.bibles.service";

@Controller("kjva")
export class KjvaBiblesController {
  constructor(private readonly service: KjvaBiblesService) {}

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
