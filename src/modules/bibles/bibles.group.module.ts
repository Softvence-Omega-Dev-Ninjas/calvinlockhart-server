// src/bible/bible.module.ts

import { Module } from '@nestjs/common';
import { KjvBiblesModule } from './kjv-bibles/kjv.bibles.module';
import { KjvaBiblesModule } from './kjva-bibles/kjva.bibles.module';
import { KjvcpBiblesModule } from './kjvcp-bibles/kjvcp.bibles.module';
import { RecommendedBooksModule } from './recomendedBook/recomdedBook.module';



@Module({
  imports: [KjvBiblesModule, KjvaBiblesModule, KjvcpBiblesModule, RecommendedBooksModule],
  providers: [],
  controllers: [],
})
export class BiblesGroupModule { }
