import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import { INestApplication } from '@nestjs/common';

let app: INestApplication;

async function bootstrap() {
  app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.useGlobalPipes(new ValidationPipe());
  try {
    await app.listen(3000);
  } catch (err) {
    Logger.error('Failed to start NestJS application:', err);
  }
}

export const getInstance = () => {
  return app;
};

bootstrap();
