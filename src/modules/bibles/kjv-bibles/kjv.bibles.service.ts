import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { bookExtras } from './bookExtra';

@Injectable()
export class KjvBiblesService {
  private readonly baseUrl = 'https://bible.helloao.org/api/eng_kjv/books.json';

  private bookCovers: Record<string, string> = {
    GEN: "https://mycdn.com/bible-covers/genesis.png",
  };

  private bookChapters: Record<string, number> = {
    GEN: 50, EXO: 40, LEV: 27, NUM: 36, DEU: 34,
    JOS: 24, JDG: 21, RUT: 4, '1SA': 31, '2SA': 24,
    '1KI': 22, '2KI': 25, '1CH': 29, '2CH': 36,
    EZR: 10, NEH: 13, EST: 10, JOB: 42, PSA: 150,
    PRO: 31, ECC: 12, SNG: 8, ISA: 66, JER: 52,
    LAM: 5, EZK: 48, DAN: 12, HOS: 14, JOL: 3,
    AMO: 9, OBA: 1, JON: 4, MIC: 7, NAM: 3,
    HAB: 3, ZEP: 3, HAG: 2, ZEC: 14, MAL: 4,
    MAT: 28, MRK: 16, LUK: 24, JHN: 21, ACT: 28,
    ROM: 16, '1CO': 16, '2CO': 13, GAL: 6, EPH: 6,
    PHP: 4, COL: 4, '1TH': 5, '2TH': 3, '1TI': 6,
    '2TI': 4, TIT: 3, PHM: 1, HEB: 13, JAS: 5,
    '1PE': 5, '2PE': 3, '1JN': 5, '2JN': 1,
    '3JN': 1, JUD: 1, REV: 22,
  };

  async getVerse(): Promise<any> {
    try {
      const response = await axios.get(`${this.baseUrl}`);
      const books = response.data.books;

      const booksWithExtras = books.map((book: any) => ({
        ...book,
        ...(bookExtras[book.id] || {})
      }))
      return booksWithExtras;
    } catch (error) {
      throw new Error('Error fetching Bible verse');
    }
  }

  async getBookWithChapter(bookId: string, chapter: string) {
    try {
      const response = await axios.get(`https://bible.helloao.org/api/eng_kjv/${bookId}/${chapter}.json`)
      return response.data;
    } catch (error) {
      throw new Error('Error fetching Bible verse');
    }
  }



  async getChapters(bookId: string): Promise<string[]> {
    const total = this.bookChapters[bookId];
    if (!total) return [];
    return Array.from({ length: total }, (_, i) => (i + 1).toString());
  }

  // Get all books IDs
  async getAllBookIds(): Promise<string[]> {
    const response = await axios.get(`${this.baseUrl}/books.json`);
    const books = response.data.books;
    if (!Array.isArray(books)) return []; // prevent crash
    return books.map((b: any) => b.id);
  }


}