import { Module } from '@nestjs/common';

import { MongoDBProvider } from './providers/mongo.provider';
import { PostgresProvider } from './providers/postgres.provider';
import { ConfigProvider } from './providers/config.provider';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [MongoDBProvider, PostgresProvider, ConfigProvider, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
