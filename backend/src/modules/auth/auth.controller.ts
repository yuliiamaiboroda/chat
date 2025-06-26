import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthDto, RefreshDto } from './dto';
import { AuthResponse, RefreshResponse } from './responses';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    type: User,
  })
  @ApiUnauthorizedResponse()
  @Get('me')
  async me(@CurrentUser() user: User) {
    return this.authService.me(user.id);
  }

  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse()
  @ApiConflictResponse()
  @Post('register')
  async register(@Body() authDto: AuthDto) {
    return this.authService.register(authDto);
  }

  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    type: AuthResponse,
  })
  @ApiUnauthorizedResponse()
  @Post('login')
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @ApiBearerAuth()
  @ApiOkResponse({
    type: RefreshResponse,
  })
  @ApiUnauthorizedResponse()
  @Post('refresh')
  async refresh(@Body() refreshDto: RefreshDto) {
    return this.authService.refresh(refreshDto.refreshToken);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiUnauthorizedResponse()
  @Post('logout')
  @HttpCode(204)
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
  }
}
