import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateChatDto {
  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isGroup: boolean;

  @ApiProperty({ type: Boolean })
  @IsBoolean()
  isPrivate: boolean;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ type: String, required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
