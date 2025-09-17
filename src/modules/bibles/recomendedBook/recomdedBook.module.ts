import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { RecommendedBooksController } from './recomendedBook.controller';
import { RecommendedBooksService } from './recomendedBook.servoce';

@Module({
    imports: [HttpModule],
    providers: [RecommendedBooksService],
    controllers: [RecommendedBooksController],
})
export class RecommendedBooksModule { }
