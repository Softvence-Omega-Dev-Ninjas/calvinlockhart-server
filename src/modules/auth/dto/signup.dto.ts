import { IsEmail, IsNotEmpty, MinLength, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignupDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @IsEmail()
  email: string;
  @ApiProperty({
    example: 'StrongPass123',
    description: 'Password (min 6 chars)',
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'StrongPass123',
    description: 'Password (min 6 chars)',
  })
  @IsNotEmpty()
  @MinLength(6)
  confirmPassword: string;
}
