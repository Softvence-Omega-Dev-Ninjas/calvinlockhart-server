import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PreceptType, TopicDestination } from "@prisma/client";

export class CreatePreceptDto {
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

export class CreateTopicDto {
  @ApiProperty({
    description: "Topic name",
    example: "The Law",
  })
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: TopicDestination,
    description: "Destination of the topic",
  })
  @IsEnum(TopicDestination)
  destination: TopicDestination;

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
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreatePreceptDto)
  precepts?: CreatePreceptDto[];
}

export class UpdateTopicDto {
  @ApiPropertyOptional({
    example: "Faith and Hope",
    description: "Updated topic name",
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    enum: TopicDestination,
    example: TopicDestination.PRECEPT_TOPIC,
    description: "Updated destination value",
  })
  @IsOptional()
  @IsEnum(TopicDestination)
  destination?: TopicDestination;
}
