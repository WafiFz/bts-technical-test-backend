import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChecklistItemDto {
  @ApiProperty({
    example: 'Buy groceries',
    description: 'The name of the checklist item',
  })
  @IsNotEmpty()
  @IsString()
  itemName: string;
}
