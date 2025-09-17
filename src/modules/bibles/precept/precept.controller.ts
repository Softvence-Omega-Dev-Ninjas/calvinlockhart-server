// precept.controller.ts
import { Controller, Get } from '@nestjs/common';
import { RandomContentService } from './precept.service';
import axios from 'axios';

@Controller('random-content')
export class RandomContentController {
    private readonly baseUrl = 'https://bible.helloao.org/api/eng_kjv/books.json';

    constructor(private readonly randomContentService: RandomContentService) { }

    @Get()
    async getRandomVerse() {
        try {
            const response = await axios.get(`${this.baseUrl}`);
            const books = response.data.books;
            const random = Math.floor(Math.random() * books.length) + 1;

            const uniqueId = books[random].id;
            const chapterRes = await axios.get(`https://bible.helloao.org/api/eng_kjv/${uniqueId}/1.json`)

            const chapContent = chapterRes.data.chapter.content;
            return chapContent[0].content[0]
        } catch (err) {

        }

    }
}



