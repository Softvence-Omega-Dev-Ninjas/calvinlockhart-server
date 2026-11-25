import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class QueryTopicDto {
  @ApiPropertyOptional({
    description: "Search keyword (topic name, reference, or content)",
    example: "law",
  })
  @IsOptional()
  @IsString()
  q?: string;
}
