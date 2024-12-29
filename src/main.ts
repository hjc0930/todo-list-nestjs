import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './common/logger/logger.config';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { ValidationPipeInstance } from './common/pipes/validation.pipe';

async function bootstrap() {
  const nodeEnv = process.env.NODE_ENV || 'default';
  Logger.log(`Node environment: ${nodeEnv}`);
  Logger.log(`App port: ${process.env.APP_PORT}`);

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger(winstonConfig),
  });

  app.useGlobalPipes(ValidationPipeInstance);
  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.APP_PORT || 8080;
  await app.listen(port);

  Logger.log(`Server is running on port: ${port}`);
}

bootstrap();
