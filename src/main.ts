import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import { SampleService } from '@src/sample/sample.service';
import { setupSwagger } from 'src/common/swagger';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // for OpenAPI
  const swaggerPath = configService.getOrThrow('SWAGGER_PATH');
  setupSwagger(app, swaggerPath);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // generate sample data
  const sampleData = configService.getOrThrow('GENERATE_SAMPLE_DATA');
  if (sampleData) {
    const sampleService = app.get(SampleService);
    await sampleService.insertSampleData();
  }

  // for hot reload
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  await app.listen(configService.getOrThrow('PORT'));

  Logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
