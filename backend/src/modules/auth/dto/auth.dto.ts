import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class AuthDto {
  @IsEmail({}, { message: 'Invalid email' })
  @IsNotEmpty({
    message: 'Email is required',
  })
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
  })
  email: string;

  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  password: string;
}
