import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { PreceptType } from "@prisma/client";

class CreatePreceptDto {
  @ApiPropertyOptional({
    enum: PreceptType,
    default: PreceptType.SCRIPTURE,
    description:
      "SCRIPTURE = Bible reference + verse text (default). FREEFORM = free text in both fields; reference may be empty.",
  })
  @IsOptional()
  @IsEnum(PreceptType)
  type?: PreceptType;

  @ApiProperty({
    description:
      "Bible verse reference (required for SCRIPTURE). For FREEFORM this is an optional free-text heading.",
    example: "Matthew 4:3",
  })
  @ValidateIf((o: { type?: PreceptType }) => o.type !== PreceptType.FREEFORM)
  @IsNotEmpty()
  @IsString()
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

export class UpdatePreceptDto {
  @ApiPropertyOptional({
    example: "Matthew 4:4",
    description: "Bible verse reference",
  })
  @IsOptional()
  @IsString()
  reference?: string;

  @ApiPropertyOptional({
    example: "Man shall not live on bread alone...",
    description: "Verse content",
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    enum: PreceptType,
    description: "Switch a precept between SCRIPTURE and FREEFORM",
  })
  @IsOptional()
  @IsEnum(PreceptType)
  type?: PreceptType;
}
