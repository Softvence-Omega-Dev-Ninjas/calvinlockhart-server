// precept.controller.ts
import { BadRequestException, Controller, Get } from "@nestjs/common";
import axios from "axios";

@Controller("random-content")
export class RandomContentController {
  private readonly baseUrl = "https://bible.helloao.org/api/eng_kjv/books.json";

  // Cache storage
  private cachedVerse: {
    bookName: string;
    chapterNumber: number;
    verseNumber: number;
    content: string;
    timestamp: number;
  } | null = null;

  @Get()
  async getRandomVerse() {
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;

    if (this.cachedVerse && now - this.cachedVerse.timestamp < ONE_DAY) {
      return this.cachedVerse;
    }

    try {
      const response = await axios.get(`${this.baseUrl}`);
      const books = response.data.books;

      const random = Math.floor(Math.random() * books.length) + 1;

      const seletedBook = books[random];
      // const UniqueId = seletedBook.id;

      const uniqueId = books[random].id;
      const chapterRes = await axios.get(
        `https://bible.helloao.org/api/eng_kjv/${uniqueId}/1.json`,
      );
      const chapContent = chapterRes.data.chapter.content;

      const firstVerse = chapContent[0]?.content[0] || "";
      const verseNumber = chapContent[0].content[0]?.number || 1;
      const chapterNumber = chapContent.number || 1;

      this.cachedVerse = {
        bookName: seletedBook.name,
        chapterNumber,
        verseNumber,
        content: firstVerse,
        timestamp: now,
      };

      return this.cachedVerse;
    } catch (err) {
      console.error(err);
      throw new BadRequestException("Failed to get random verse");
    }
  }
}
