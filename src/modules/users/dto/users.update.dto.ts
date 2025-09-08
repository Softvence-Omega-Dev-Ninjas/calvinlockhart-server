import { IsOptional, IsString, MinLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'Software engineer with 5 years experience',
    description: 'User biography',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  bio?: string;

  @ApiProperty({
    example: 'https://example.com/avatar.png',
    description: 'Profile picture URL',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  userAvatar?: string;
}
