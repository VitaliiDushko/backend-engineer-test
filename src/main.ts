import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
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
  await app.listen(3000);
}

export const getInstance = () => {
  return app;
};

bootstrap();
