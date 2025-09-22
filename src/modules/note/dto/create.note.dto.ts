import { IsOptional, IsString } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateNoteDto {
  @ApiPropertyOptional({
    example: "This a note",
    description: "Optional note description",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "Topic ID to link the note to" })
  @IsString()
  topicId: string;
}

export class UpdateNoteDto {
  @ApiPropertyOptional({
    example: "This a update note",
    description: "Updated note description",
  })
  @IsOptional()
  @IsString()
  description?: string;
}
