import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsNotEmpty, ValidateNested } from "class-validator";

class CreatePreceptDto {
  @ApiProperty({
    description: "Bible verse reference",
    example: "Matthew 4:3",
  })
  @IsNotEmpty()
  reference: string;

  @ApiProperty({
    description: "Verse content",
    example: "But seek first his kingdom and his righteousness...",
  })
  @IsNotEmpty()
  content: string;
}

export class AddPreceptsDto {
  @ApiPropertyOptional({
    description: "List of precepts (Bible verses) related to the topic",
    type: [CreatePreceptDto],
    example: [
      {
        reference: "Matthew 4:3",
        content: "But seek first his kingdom and his righteousness...",
      },
      {
        reference: "Romans 6:14",
        content: "For sin shall no longer be your master...",
      },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreatePreceptDto)
  precepts?: CreatePreceptDto[];
}
