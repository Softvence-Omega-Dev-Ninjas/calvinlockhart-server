export interface IBookResponse {
  book: string; // Capitalized book name
  chapters: number; // Number of chapters in the book
  text: string; // Example text (first verse of chapter 1)
}

export interface IChapterResponse {
  book: string; // Capitalized book name
  chapter: number; // Chapter number
  verses: number; // Number of verses in the chapter
  text: string[]; // All verses in the chapter
}

export interface IVerseResponse {
  book: string; // Capitalized book name
  chapter: number; // Chapter number
  verse: number; // Verse number
  text: string; // The verse text
}
