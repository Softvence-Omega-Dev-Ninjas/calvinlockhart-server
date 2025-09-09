// src/bible/bible.controller.ts

import { Controller, Get, Param } from '@nestjs/common';
import { BibleService } from './bibles.service';

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get(':reference')
  async getVerse(@Param('reference') reference: string) {
    const verse = await this.bibleService.getVerse(reference);
    return {
      message: 'Verse fetched successfully',
      data: verse,
    };
  }
}
