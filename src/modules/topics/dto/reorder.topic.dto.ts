import { IsArray, IsEnum, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { TopicDestination } from "@prisma/client";

export class ReorderTopicsDto {
  @ApiProperty({
    enum: TopicDestination,
    description: "Category destination of topics being reordered",
    example: TopicDestination.PRECEPT_TOPIC,
  })
  @IsNotEmpty()
  @IsEnum(TopicDestination)
  destination: TopicDestination;

  @ApiProperty({
    description:
      "Ordered array of topic UUIDs in their new sequence (array index = order position)",
    example: [
      "550e8400-e29b-41d4-a716-446655440000",
      "7c9e6679-7425-40de-944b-e07fc1f90ae7",
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  topicIds: string[];
}
