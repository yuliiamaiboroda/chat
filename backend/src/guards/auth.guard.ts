import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

import { UserService } from '../modules/user/user.service';
import { AuthService } from 'src/modules/auth/auth.service';

import { User } from 'src/entities/user.entity';
import {
  USER_SESSION_CACHE_KEY_BASE,
  UserTokenData,
} from 'src/types/auth.types';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,

    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload: UserTokenData = this.authService.verifyUserToken(token);
      const user: User = await this.validateUserInDatabase(payload);
      await this.validateUserSession(payload);

      request['user'] = user;
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private async validateUserInDatabase(payload: UserTokenData): Promise<User> {
    const user: User = await this.userService.getOne({
      id: payload.id,
      email: payload.email.toLowerCase(),
    });
    if (!user) throw new UnauthorizedException();

    return user;
  }

  private async validateUserSession(payload: UserTokenData) {
    const secret = await this.cacheManager.get(
      `${USER_SESSION_CACHE_KEY_BASE + payload.id}`,
    );

    if (secret !== payload.secret) throw new UnauthorizedException();
  }
}
