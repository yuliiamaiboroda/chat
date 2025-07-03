import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

import { MongoDBProvider } from './providers/mongo.provider';
import { PostgresProvider } from './providers/postgres.provider';
import { ConfigProvider } from './providers/config.provider';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ChatModule } from './modules/chat/chat.module';
import { ChatMemberModule } from './modules/chat-member/chat-member.module';

@Module({
  imports: [
    MongoDBProvider,
    PostgresProvider,
    ConfigProvider,
    AuthModule,
    UserModule,
    CacheModule.register({ isGlobal: true }),
    ChatModule,
    ChatMemberModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
