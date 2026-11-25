import { Injectable } from "@nestjs/common";
import axios from "axios";
import { bookExtras } from "./bookExtra";

@Injectable()
export class KjvBiblesService {
  private readonly baseUrl = "https://bible.helloao.org/api/eng_kjv/books.json";

  private bookCovers: Record<string, string> = {
    GEN: "https://mycdn.com/bible-covers/genesis.png",
  };

  async getVerse(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      const books = response.data.books;

      const booksWithExtras = books.map((book: any) => ({
        ...book,
        ...(bookExtras[book.id] || {}),
      }));
      return booksWithExtras;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching Bible verse");
    }
  }

  async getBookWithChapter(bookId: string, chapter: string) {
    try {
      const response = await axios.get(
        `https://bible.helloao.org/api/eng_kjv/${bookId}/${chapter}.json`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching Bible verse");
    }
  }
}
