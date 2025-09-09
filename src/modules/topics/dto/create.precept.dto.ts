import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, ValidateNested } from "class-validator";
import { CreatePreceptDto } from "./create.topic.dto";




export class AddPreceptsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePreceptDto)
  precepts: CreatePreceptDto[];
}

