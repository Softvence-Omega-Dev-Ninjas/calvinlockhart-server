import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface Book {
    id?: string | number;
    abbrev?: string;
    name?: string;
    chapters?: number;
    [key: string]: any; // allow extra fields
}

/**
 * Add extra info for books here (optional).
 * Use book.id or book.abbrev as the key.
 */
const bookExtrasR: Record<string | number, Partial<Book>> = {
    GEN: {
        coverImage: 'https://i.ibb.co.com/bjtPHXfv/gen.jpg',
        author: 'Moses',
    },
    EXO: {
        coverImage: 'https://i.ibb.co.com/KchfkCtt/exo.jpg',
        author: 'Moses',
    },
    LEV: {
        coverImage: 'https://i.ibb.co.com/p8XSS99/lev.webp',
        author: 'Moses',
    },
    NUM: {
        coverImage: 'https://i.ibb.co.com/gMdmbFyW/num.webp',
        author: 'Moses',
    },
    DEU: {
        coverImage: 'https://i.ibb.co.com/yBVzY4NF/dum.jpg',
        author: 'Moses',
    },
    JOS: {
        coverImage: 'https://i.ibb.co.com/WNWngvds/jos.jpg',
        author: 'Joshua',
    },
    JDG: {
        coverImage: 'https://i.ibb.co.com/C5MLVRNq/jud.webp',
        author: 'Samuel',
    },
    RUT: {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'Samuel',
    },
    EZR: {
        coverImage: 'https://i.ibb.co.com/TS17fzY/ezra.jpg',
        author: 'Ezra',
    },
    NEH: {
        coverImage: 'https://example.com/images/bible/nehemiah-cover.jpg',
        author: 'Nehemiah',
    },
    EST: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Mordecai',
    },
    JOB: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Unknown',
    },
    PSA: {
        coverImage: 'https://example.com/images/bible/psalms-cover.jpg',
        author: 'David, Asaph, Sons of Korah, others',
    },
    PRO: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Solomon',
    },
    ECC: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Solomon',
    },
    SON: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Solomon',
    },
    ISA: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Isaiah',
    },
    JER: {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Jeremiah',
    },
    LAM: {
        coverImage: 'https://i.ibb.co.com/gMdmbFyW/num.webp',
        author: 'Jeremiah',
    },
    EZK: {
        coverImage: 'https://i.ibb.co.com/gMdmbFyW/num.webp',
        author: 'Ezekiel',
    },
    DAN: {
        coverImage: 'https://i.ibb.co.com/gMdmbFyW/num.webp',
        author: 'Daniel',
    },
    HOS: {
        coverImage: 'https://i.ibb.co.com/gMdmbFyW/num.webp',
        author: 'Hosea',
    },
    JOL: {
        coverImage: 'https://i.ibb.co.com/wZ4y7pZk/jhon.jpg',
        author: 'Joel',
    },
    AMO: {
        coverImage: 'https://i.ibb.co.com/wZ4y7pZk/jhon.jpg',
        author: 'Amos',
    },
    OBA: {
        coverImage: 'https://i.ibb.co.com/wZ4y7pZk/jhon.jpg',
        author: 'Obadiah',
    },
    JON: {
        coverImage: 'https://i.ibb.co.com/wZ4y7pZk/jhon.jpg',
        author: 'Jonah',
    },
    MIC: {
        coverImage: 'https://i.ibb.co.com/Nds5pJhm/sum.jpg',
        author: 'Micah',
    },
    NAM: {
        coverImage: 'https://i.ibb.co.com/Nds5pJhm/sum.jpg',
        author: 'Nahum',
    },
    HAB: {
        coverImage: 'https://i.ibb.co.com/HfDRnY4F/hal.jpg',
        author: 'Habakkuk',
    },
    ZEP: {
        coverImage: 'https://i.ibb.co.com/Nds5pJhm/sum.jpg',
        author: 'Zephaniah',
    },
    HAG: {
        coverImage: 'https://i.ibb.co.com/2Yhp3Kqv/cho.jpg',
        author: 'Haggai',
    },
    ZEC: {
        coverImage: 'https://i.ibb.co.com/Nds5pJhm/sum.jpg',
        author: 'Zechariah',
    },
    MAL: {
        coverImage: 'https://i.ibb.co.com/8DtSd9tQ/matt.jpg',
        author: 'Malachi',
    },
    MAT: {
        coverImage: 'https://i.ibb.co.com/8DtSd9tQ/matt.jpg',
        author: 'Matthew',
    },
    MRK: {
        coverImage: 'https://i.ibb.co.com/8DtSd9tQ/matt.jpg',
        author: 'John Mark',
    },
    LUK: {
        coverImage: 'https://i.ibb.co.com/4w6Ws9r3/luke.png',
        author: 'Luke',
    },
    JHN: {
        coverImage: 'https://i.ibb.co.com/wZ4y7pZk/jhon.jpg',
        author: 'John',
    },
    ACT: {
        coverImage: 'https://i.ibb.co.com/fz4jpDnD/act.jpg',
        author: 'Luke',
    },
    ROM: {
        coverImage: 'https://i.ibb.co.com/PGWJhsH8/5220d43e0cc47a9d50ac3750acedef1d.jpg',
        author: 'Paul',
    },
    GAL: {
        coverImage: 'https://i.ibb.co.com/PGWJhsH8/5220d43e0cc47a9d50ac3750acedef1d.jpg',
        author: 'Paul',
    },
    EPH: {
        coverImage: 'https://i.ibb.co.com/PGWJhsH8/5220d43e0cc47a9d50ac3750acedef1d.jpg',
        author: 'Paul',
    },
    PHP: {
        coverImage: 'https://i.ibb.co.com/PGWJhsH8/5220d43e0cc47a9d50ac3750acedef1d.jpg',
        author: 'Paul',
    },
    COL: {
        coverImage: 'https://i.ibb.co.com/PGWJhsH8/5220d43e0cc47a9d50ac3750acedef1d.jpg',
        author: 'Paul',
    },
    JUD: {
        coverImage: 'https://i.ibb.co.com/C5MLVRNq/jud.webp',
        author: 'Jude',
    },
    REV: {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'John',
    },
    '1SA': {
        coverImage: 'https://i.ibb.co.com/Nds5pJhm/sum.jpg',
        author: 'Samuel',
    },
    '2SA': {
        coverImage: 'https://i.ibb.co.com/Nds5pJhm/sum.jpg',
        author: 'Samuel',
    },
    '1KI': {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Jeremiah',
    },
    '2KI': {
        coverImage: 'https://i.ibb.co.com/cKsFcG2z/king.jpg',
        author: 'Jeremiah',
    },
    '1CH': {
        coverImage: 'https://i.ibb.co.com/2Yhp3Kqv/cho.jpg',
        author: 'Ezra',
    },
    '2CH': {
        coverImage: 'https://i.ibb.co.com/2Yhp3Kqv/cho.jpg',
        author: 'Ezra',
    },
    '1CO': {
        coverImage: 'https://i.ibb.co.com/2Yhp3Kqv/cho.jpg',
        author: 'Paul',
    },
    '2CO': {
        coverImage: 'https://i.ibb.co.com/2Yhp3Kqv/cho.jpg',
        author: 'Paul',
    },
    '1TH': {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'Paul',
    },
    '2TH': {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'Paul',
    },
    '1TI': {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'Paul',
    },
    '2TI': {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'Paul',
    },
    TIT: {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'Paul',
    },
    PHM: {
        coverImage: 'https://example.com/images/bible/philemon-cover.jpg',
        author: 'Paul',
    },
    HEB: {
        coverImage: 'https://example.com/images/bible/hebrews-cover.jpg',
        author: 'Unknown',
    },
    JAS: {
        coverImage: 'https://i.ibb.co.com/whKMY0m0/rud.jpg',
        author: 'James',
    },
    '1PE': {
        coverImage: 'https://i.ibb.co.com/Xf2hV7mn/john.jpg',
        author: 'Peter',
    },
    '2PE': {
        coverImage: 'https://i.ibb.co.com/Xf2hV7mn/john.jpg',
        author: 'Peter',
    },
    '1JN': {
        coverImage: 'https://i.ibb.co.com/Xf2hV7mn/john.jpg',
        author: 'John',
    },
    '2JN': {
        coverImage: 'https://i.ibb.co.com/Xf2hV7mn/john.jpg',
        author: 'John',
    },
    '3JN': {
        coverImage: 'https://i.ibb.co.com/Xf2hV7mn/john.jpg',
        author: 'John',
    },
};

@Injectable()
export class RecommendedBooksService {
    private readonly logger = new Logger(RecommendedBooksService.name);

    private readonly apis = {
        kjv: 'https://bible.helloao.org/api/eng_kjv/books.json',
        kja: 'https://bible.helloao.org/api/eng_kja/books.json',
        cpb: 'https://bible.helloao.org/api/eng_cpb/books.json',
    };

    // Fetch and normalize books
    private async fetchBooks(url: string): Promise<Book[]> {
        try {
            const response = await axios.get(url);
            const payload = response?.data;
            // Some APIs might wrap in { books: [...] }, others just return []
            const books = Array.isArray(payload?.books) ? payload.books : payload;

            if (!Array.isArray(books)) {
                this.logger.warn(`Unexpected response from ${url}`);
                return [];
            }

            // Merge extras
            return books.map((book: Book) => {
                const key = book.id ?? book.abbrev ?? '';
                return {
                    ...book,
                    ...(bookExtrasR[key] || {}),
                };
            });
        } catch (error: any) {
            this.logger.error(`Error fetching books from ${url}`, error?.message);
            return [];
        }
    }

    // Pick N random books
    private pickRandomBooks(books: Book[], count: number): Book[] {
        if (!Array.isArray(books) || books.length === 0) return [];
        const shuffled = [...books].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // Get 3 random books from each version
    async getRecommendedBooks(): Promise<{
        kjv: Book[];
        kja: Book[];
        cpb: Book[];
    }> {
        const [kjvBooks, kjaBooks, cpbBooks] = await Promise.all([
            this.fetchBooks(this.apis.kjv),
            this.fetchBooks(this.apis.kja),
            this.fetchBooks(this.apis.cpb),
        ]);

        return {
            kjv: this.pickRandomBooks(kjvBooks, 3),
            kja: this.pickRandomBooks(kjaBooks, 3),
            cpb: this.pickRandomBooks(cpbBooks, 3),
        };
    }
}