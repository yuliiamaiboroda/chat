import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/entities/user.entity';

export class AuthResponse {
  @ApiProperty({ type: User })
  user: Omit<User, 'password'>;

  @ApiProperty({ type: String })
  token: string;

  @ApiProperty({ type: String })
  refreshToken: string;
}
