import { Module } from "@nestjs/common";
import { NotesController } from "./note.controller";
import { NotesService } from "./note.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  controllers: [NotesController],
  providers: [NotesService],
  imports:[AuthModule]
})
export class NotesModule {}