import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

export const PostgresProvider = TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    host: configService.getOrThrow('postgres.host'),
    port: configService.getOrThrow('postgres.port'),
    username: configService.getOrThrow('postgres.user'),
    password: configService.get('postgres.password'),
    database: configService.getOrThrow('postgres.name'),
    autoLoadEntities: true,
    migrations: ['**/migrations'],
    synchronize: false,
  }),
});
