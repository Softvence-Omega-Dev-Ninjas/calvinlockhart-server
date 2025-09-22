import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, MinLength } from "class-validator";

export class setPasswordDto {
  @ApiProperty({ example: "NewStrongPass123", description: "New password" })
  @IsNotEmpty()
  @MinLength(6)
  oldPassword: string;

  @ApiProperty({ example: "NewStrongPass123", description: "New password" })
  @IsNotEmpty()
  @MinLength(6)
  newPassword: string;

  @ApiProperty({
    example: "NewStrongPass123",
    description: "Confirm password (must match newPassword)",
  })
  @IsNotEmpty()
  confirmPassword: string;
}
