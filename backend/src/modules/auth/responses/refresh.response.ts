import { ApiProperty } from '@nestjs/swagger';

export class RefreshResponse {
  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
