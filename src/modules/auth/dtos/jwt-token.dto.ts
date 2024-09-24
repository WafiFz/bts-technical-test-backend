import { ApiProperty } from '@nestjs/swagger';

export default class JwtTokenDto {
  @ApiProperty({
    type: String,
  })
  readonly token: string = '';
}
