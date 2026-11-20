import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule, ObserveInstrument } from './app.module.js';
import { allowedWebOrigins } from './auth/origins.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  });
  const allowedOrigins = (process.env.WEB_ORIGINS ?? 'http://localhost:3000,http://localhost:3001').split(',').map((origin) => origin.trim());
  app.enableCors({ origin: allowedOrigins, credentials: true });
  await app.listen(4001);
}
await bootstrap();




