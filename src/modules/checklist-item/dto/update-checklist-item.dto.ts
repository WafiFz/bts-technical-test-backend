import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateChecklistItemDto {
  @ApiProperty({
    example: 'Buy more groceries',
    description: 'The new name of the checklist item',
  })
  @IsNotEmpty()
  @IsString()
  itemName: string;
}
