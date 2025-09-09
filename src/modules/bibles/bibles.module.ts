// src/bible/bible.module.ts

import { Module } from '@nestjs/common';
import { BibleService } from './bibles.service';
import { BibleController } from './bibles.controller';

@Module({
  providers: [BibleService],
  controllers: [BibleController],
})
export class BibleModule {}
