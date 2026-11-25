import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReorderPreceptsDto {
  @ApiProperty({
    description: "UUID of the topic whose precepts are being reordered",
    example: "550e8400-e29b-41d4-a716-446655440000",
  })
  @IsNotEmpty()
  @IsString()
  topicId: string;

  @ApiProperty({
    description:
      "Ordered array of precept UUIDs in their new sequence (array index = order position)",
    example: [
      "9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d",
      "1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed",
    ],
  })
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  preceptIds: string[];
}
