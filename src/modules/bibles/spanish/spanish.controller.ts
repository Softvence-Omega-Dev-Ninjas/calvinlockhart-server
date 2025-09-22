import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { SpanishService } from "./spanish.service";

@Controller("spanish")
export class SpanishController {
  constructor(private readonly service: SpanishService) {}

  // GET /spanish/:book
  @Get(":book")
  getBook(@Param("book") book: string) {
    return this.service.getBook(book.toLowerCase());
  }

  // GET /spanish/:book/chapter/:chapter
  @Get(":book/chapter/:chapter")
  getChapter(
    @Param("book") book: string,
    @Param("chapter", ParseIntPipe) chapter: number,
  ) {
    return this.service.getChapter(book, chapter);
  }

  // GET /spanish/:book/chapter/:chapter/verse/:verse
  @Get(":book/chapter/:chapter/verse/:verse")
  getVerse(
    @Param("book") book: string,
    @Param("chapter", ParseIntPipe) chapter: number,
    @Param("verse", ParseIntPipe) verse: number,
  ) {
    return this.service.getVerse(book, chapter, verse);
  }
}
