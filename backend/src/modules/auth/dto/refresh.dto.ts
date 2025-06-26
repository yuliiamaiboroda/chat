import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RefreshDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'The refresh token of the user',
    example: 'refreshToken',
  })
  refreshToken: string;
}
