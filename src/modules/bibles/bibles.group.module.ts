// src/bible/bible.module.ts

import { Module } from '@nestjs/common';
import { KjvBiblesModule } from './kjv-bibles/kjv.bibles.module';
import { KjvaBiblesModule } from './kjva-bibles/kjva.bibles.module';
import { KjvcpBiblesModule } from './kjvcp-bibles/kjvcp.bibles.module';


@Module({
  imports:[KjvBiblesModule, KjvaBiblesModule, KjvcpBiblesModule],
  providers: [],
  controllers: [],
})
export class BiblesGroupModule {}
