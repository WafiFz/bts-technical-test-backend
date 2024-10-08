import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ValidationError } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApiConfigService } from '@/shared/services/api-config.service';

import AppModule from '@/app.module';

import ValidationExceptions from '@/exceptions/validation.exceptions';

import {
  BadRequestExceptionFilter,
  UnauthorizedExceptionFilter,
  ForbiddenExceptionFilter,
  ValidationExceptionsFilter,
  NotFoundExceptionFilter,
  AllExceptionsFilter,
} from '@/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (errors: ValidationError[]) =>
        new ValidationExceptions(errors),
    }),
  );

  app.useGlobalFilters(
    new AllExceptionsFilter(),
    new UnauthorizedExceptionFilter(),
    new ForbiddenExceptionFilter(),
    new BadRequestExceptionFilter(),
    new NotFoundExceptionFilter(),
    new ValidationExceptionsFilter(),
  );

  const configService = app.get(ApiConfigService);
  const port = configService.getNumber('SERVER_PORT', 3000);

  const options = new DocumentBuilder()
    .setTitle('Api v1')
    .setDescription('API for checklist')
    .setVersion('1.0')
    .addBearerAuth({ in: 'header', type: 'http' })
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);

  const isProduction = configService.isProduction;

  app.enableCors();
  if (isProduction) {
    await app.listen(3000, '0.0.0.0');
  } else {
    await app.listen(port, async () => {
      console.log(
        `The server is running on ${port} port: http://localhost:${port}/api`,
      );
    });
  }
}

bootstrap();
