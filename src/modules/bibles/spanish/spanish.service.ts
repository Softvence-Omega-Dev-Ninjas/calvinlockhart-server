import { Injectable, NotFoundException } from "@nestjs/common";
import { IBookResponse, IChapterResponse, IVerseResponse } from "./interface";
import { capitalizeFirst } from "src/common/utils/capitalize";
import * as path from "path";

// Valid book names
const books = [
  "1corintios",
  "1cronicas",
  "1juan",
  "1pedro",
  "1reyes",
  "1samuel",
  "1tesalonicenses",
  "1timoteo",
  "2corintios",
  "2cronicas",
  "2juan",
  "2pedro",
  "2reyes",
  "2samuel",
  "2tesalonicenses",
  "2timoteo",
  "3juan",
  "abdias",
  "amos",
  "apocalipsis",
  "cantares",
  "colosenses",
  "daniel",
  "deuteronomio",
  "eclesiastes",
  "efesios",
  "esdras",
  "ester",
  "exodo",
  "ezequiel",
  "filemon",
  "filipenses",
  "galatas",
  "genesis",
  "habacuc",
  "hageo",
  "hebreos",
  "hechos",
  "isaias",
  "jeremias",
  "job",
  "joel",
  "jonas",
  "josue",
  "juan",
  "judas",
  "jueces",
  "lamentaciones",
  "levitico",
  "lucas",
  "malaquias",
  "marcos",
  "mateo",
  "miqueas",
  "nahum",
  "nehemias",
  "numeros",
  "oseas",
  "proverbios",
  "romanos",
  "rut",
  "salmos",
  "santiago",
  "sofonias",
  "tito",
  "zacarias",
];

@Injectable()
export class SpanishService {
  private getDb(book: string): any {
    if (!books.includes(book)) {
      throw new NotFoundException(`Book ${book} not found.`);
    }
    // __dirname points to dist/... after build
    const filePath = path.join(__dirname, "db", book);
    try {
      const bookModule = require(filePath); // Node will load default export
      return bookModule.default ?? bookModule; // handle default export
    } catch (err) {
      console.error(err);
      throw new NotFoundException(`Bible file not found: ${filePath}`);
    }
  }

  getBook(book: string): IBookResponse {
    const db = this.getDb(book);
    return {
      book: capitalizeFirst(book),
      chapters: db.length - 1,
      text: db[0][0],
    };
  }

  // Get a full chapter
  getChapter(book: string, chapter: number): IChapterResponse {
    const db = this.getDb(book);
    const chapterData = db[chapter]; // chapter 1 = index 1
    const chap = chapter && db[chapter] ? chapter : 1;
    if (!chapterData) {
      throw new NotFoundException(
        `Chapter ${chapter} is not found in this ${capitalizeFirst(book)} here total chapter is ${chap}`,
      );
    }

    return {
      book: capitalizeFirst(book),
      chapter: chap,
      verses: db[chap].length - 1,
      // text: chapterData,
      text: db[chap],
    };
  }
  // Get a single verse
  getVerse(book: string, chapter: number, verse: number): IVerseResponse {
    const chapterData = this.getChapter(book, chapter).text;
    const verseText = chapterData[verse - 1];
    if (!verseText) {
      throw new NotFoundException(
        `Verse ${verse} not found in ${capitalizeFirst(book)} chapter ${chapter}`,
      );
    }

    return {
      book: capitalizeFirst(book),
      chapter,
      verse,
      text: verseText,
    };
  }
}
