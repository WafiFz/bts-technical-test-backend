import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChecklistDto {
  @ApiProperty({
    example: 'My Checklist',
    description: 'The name of the checklist',
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
