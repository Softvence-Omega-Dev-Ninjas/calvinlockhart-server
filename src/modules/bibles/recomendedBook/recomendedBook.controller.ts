import { Controller, Get } from "@nestjs/common";
import { RecommendedBooksService } from "./recomendedBook.servoce";

@Controller('recommended-books')
export class RecommendedBooksController {
    constructor(private readonly service: RecommendedBooksService) { }

    @Get()
    async getBooks() {
        return this.service.getRecommendedBooks();
    }
}



