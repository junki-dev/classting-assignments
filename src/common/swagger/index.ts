import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication, path: string): void {
  const options = new DocumentBuilder()
    .setTitle('News Feed OpenAPI')
    .setDescription('News Feed OpenAPI')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path, app, document);
}
