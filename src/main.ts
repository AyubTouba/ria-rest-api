import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const options = new DocumentBuilder()
    .setTitle('WebTracker API')
    .setDescription('The WebTracker API description')
    .setVersion('0.1.0-beta')
    .addTag('webTracker')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.setGlobalPrefix('api');

  app.enableCors();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
