import { Injectable } from "@nestjs/common";
import axios from "axios";
import { bookExtrasss } from "./bookExtrass";

@Injectable()
export class KjvcpBiblesService {
  private readonly baseUrl = "https://bible.helloao.org/api/eng_cpb/books.json";

  async getVerse(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      const books = response.data.books;
      const booksWithExtrasss = books.map((book: any) => ({
        ...book,
        ...(bookExtrasss[book.id] || {}),
      }));
      return booksWithExtrasss;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching Bible verse");
    }
  }

  async getBookWithChapter(bookId: string, chapter: string) {
    try {
      const response = await axios.get(
        `https://bible.helloao.org/api/eng_cpb/${bookId}/${chapter}.json`,
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw new Error("Error fetching Bible verse");
    }
  }

  // Get all chapters of a book
  async getChapters(bookId: string): Promise<string[]> {
    const book = await axios.get(`${this.baseUrl}/${bookId}.json`);
    return book.data.chapters.map((c) => c.number.toString());
  }

  // Get all books IDs
  async getAllBookIds(): Promise<string[]> {
    const response = await axios.get(`${this.baseUrl}/books.json`);
    const books = response.data.books;
    if (!Array.isArray(books)) return []; // prevent crash
    return books.map((b: any) => b.id);
  }
}
