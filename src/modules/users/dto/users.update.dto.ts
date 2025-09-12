import { IsOptional, IsString, MinLength, IsUrl } from 'class-validator';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({
    example: 'john',
    description: 'Firstname ',
    required: false,
  })
  @IsOptional()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'doe',
    description: 'Lastname',
    required: false,
  })
  @IsString()
  lastName: string;
  @ApiProperty({
    example: 'Software engineer with 5 years experience',
    description: 'User biography',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  bio?: string;


  @IsOptional()
  @IsUrl()
  userAvatar?: string;

  @ApiProperty({ type: 'string', format: 'binary', description: 'The file to upload' })
  @IsOptional()
  file?: any; // Represents the uploaded file
}


export const apiBodyExample = {
  schema: {
    type: "object",
    properties: {
      files: {
        type: "array",
        items: {
          type: "string",
          format: "binary",
        },
        maxItems: 20,
      },
    },
  },
};
