// precept.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { books } from './book'


@Injectable()
export class RandomContentService {
    private readonly logger = new Logger(RandomContentService.name);

    private async getBookWithChapter(bookId: string, chapter: number) {
        try {
            const url = `https://bible.helloao.org/api/eng_kjv/${bookId}/${chapter}.json`;
            const response = await axios.get(url);
            return response.data;
        } catch (error: any) {
            this.logger.error(`Error fetching ${bookId} chapter ${chapter}`, error.message);
            return null; // return null instead of throwing
        }
    }

    async getRandomContent(retries = 10) {
        for (let attempt = 0; attempt < retries; attempt++) {
            const book = books[Math.floor(Math.random() * books.length)];
            const chapterNum = Math.floor(Math.random() * book.numberOfChapters) + 1;

            const chapterData = await this.getBookWithChapter(book.id, chapterNum);

            if (!chapterData?.content?.length) {
                this.logger.warn(`No content in ${book.name} chapter ${chapterNum}`);
                continue; // try again
            }

            let verses = chapterData.content.filter(c => c.type === 'verse');
            if (!verses.length) verses = chapterData.content;

            const verse = verses[Math.floor(Math.random() * verses.length)];

            return {
                book: book.name,
                chapter: chapterData.number,
                verse: verse.number ?? 1,
                text: verse.content?.map(c => (typeof c === 'string' ? c : '')).join(' ').trim() ?? '',
            };
        }

        // throw new Error('Could not get random content after retries');
    }
}
