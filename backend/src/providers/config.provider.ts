import { ConfigModule } from '@nestjs/config';

import postgresConfig from '../config/postgres.config';
import mongoConfig from '../config/mongo.config';
import corsConfig from '../config/cors.config';
import authConfig from '../config/auth.config';

export const ConfigProvider = ConfigModule.forRoot({
  isGlobal: true,
  load: [postgresConfig, mongoConfig, corsConfig, authConfig],
});
