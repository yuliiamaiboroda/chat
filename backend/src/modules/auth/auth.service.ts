import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import {
  USER_REFRESH_TOKEN_CACHE_KEY_BASE,
  USER_SESSION_CACHE_KEY_BASE,
  UserRefreshTokenData,
  UserTokenData,
} from 'src/types/auth.types';
import { User } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { createHash } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import * as argon2 from 'argon2';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AuthDto } from './dto';
import { AuthResponse, RefreshResponse } from './responses';

@Injectable()
export class AuthService {
  tokenTtl = this.configService.getOrThrow('token.ttl');
  tokenSecret = this.configService.getOrThrow('token.secret');

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,

    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {}

  async login(authDto: AuthDto): Promise<AuthResponse> {
    const { email: emailFromDto, password } = authDto;
    const email = emailFromDto.trim().toLowerCase();

    const user = await this.userService.getOne({ email });
    if (!user) throw new UnauthorizedException();

    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);
    const { token, refreshToken } = tokens;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;

    return {
      user: userData,
      token,
      refreshToken,
    };
  }

  async register(authDto: AuthDto): Promise<AuthResponse> {
    const { email: emailFromDto, password } = authDto;
    const email = emailFromDto.trim().toLowerCase();

    const userInstance = await this.userService.getOne({ email });
    if (userInstance) throw new ConflictException('User already exists');

    const hashedPassword = await argon2.hash(password);
    const user = await this.userService.create({
      email,
      password: hashedPassword,
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, ...userData } = user;

    const tokens = await this.generateTokens(user);
    const { token, refreshToken } = tokens;

    return {
      user: userData,
      token,
      refreshToken,
    };
  }

  async refresh(refreshToken: string): Promise<RefreshResponse> {
    const payload: UserRefreshTokenData =
      this.verifyUserRefreshToken(refreshToken);
    if (!payload) throw new UnauthorizedException();

    const secret = await this.cacheManager.get(
      `${USER_REFRESH_TOKEN_CACHE_KEY_BASE + payload.id}`,
    );
    if (secret !== payload.secret) throw new UnauthorizedException();

    const user = await this.userService.getOne({ id: payload.id });
    if (!user) throw new UnauthorizedException();

    const tokens = await this.generateTokens(user);
    const { token, refreshToken: newRefreshToken } = tokens;

    return {
      token,
      refreshToken: newRefreshToken,
    };
  }

  async logout(userId: number): Promise<void> {
    await this.cacheManager.del(`${USER_SESSION_CACHE_KEY_BASE + userId}`);
    await this.cacheManager.del(
      `${USER_REFRESH_TOKEN_CACHE_KEY_BASE + userId}`,
    );
  }

  async me(userId: number): Promise<Omit<User, 'password'>> {
    const user = await this.userService.getOne({ id: userId });

    const { password: _, ...userData } = user;

    return userData;
  }

  private async generateTokens(user: User): Promise<{
    token: string;
    refreshToken: string;
  }> {
    const secret = this.generateSecret();
    await this.cacheManager.set(
      `${USER_SESSION_CACHE_KEY_BASE + user.id}`,
      secret,
    );

    const refreshSecret = this.generateSecret();
    await this.cacheManager.set(
      `${USER_REFRESH_TOKEN_CACHE_KEY_BASE + user.id}`,
      refreshSecret,
    );

    const token = this.generateUserToken(user, secret);
    const refreshToken = this.generateUserRefreshToken(user, refreshSecret);

    return {
      token,
      refreshToken,
    };
  }

  private generateSecret(): string {
    return createHash('sha256').update(uuid()).digest('hex');
  }

  private generateUserToken(user: User, secret: string): string {
    const payload: UserTokenData = {
      id: user.id,
      email: user.email,
      secret,
    };

    return sign(payload, this.tokenSecret, {
      expiresIn: this.tokenTtl,
    });
  }

  private generateUserRefreshToken(user: User, secret: string): string {
    const payload: UserRefreshTokenData = {
      id: user.id,
      secret,
    };

    return sign(payload, this.tokenSecret, {
      expiresIn: this.tokenTtl,
    });
  }

  private verifyUserRefreshToken(token: string): UserRefreshTokenData {
    return verify(token, this.tokenSecret, {
      ignoreExpiration: false,
    }) as UserRefreshTokenData;
  }

  verifyUserToken(token: string): UserTokenData {
    return verify(token, this.tokenSecret, {
      ignoreExpiration: false,
    }) as UserTokenData;
  }
}
