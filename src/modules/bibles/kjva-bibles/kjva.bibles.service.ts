import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { bookExtrass } from './bookExtras';

@Injectable()
export class KjvaBiblesService {
  private readonly baseUrl = 'https://bible.helloao.org/api/eng_kja/books.json';

  async getVerse(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}`);

      const books = response.data.books;
      const booksWithExtrass = books.map((book: any) => ({
        ...book,
        ...(bookExtrass[book.id] || {})
      }))

      return booksWithExtrass;
    } catch (error) {
      throw new Error('Error fetching Bible verse');
    }
  }
  async getBookWithChapter(bookId: string, chapter: string) {
    try {
      const response = await axios.get(`https://bible.helloao.org/api/eng_kja/${bookId}/${chapter}.json`)
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Bible verse');
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