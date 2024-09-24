import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export default class LoginDto {
  @ApiProperty({
    type: String,
    example: 'wafi123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(128)
  readonly username: string = '';

  @ApiProperty({
    type: String,
    example: 'secureP@ssw0rd',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  readonly password: string = '';
}
