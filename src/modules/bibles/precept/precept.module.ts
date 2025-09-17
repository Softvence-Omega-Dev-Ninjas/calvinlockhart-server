// precept.module.ts
import { Module } from '@nestjs/common';
import { RandomContentService } from './precept.service';
import { RandomContentController } from './precept.controller';

@Module({
    providers: [RandomContentService],
    controllers: [RandomContentController],
})
export class RandomContentModule { }

