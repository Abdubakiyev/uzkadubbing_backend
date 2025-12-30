import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Frontend portini ruxsat berish (CORS)
  app.enableCors({
    origin: 'https://uzkadubbing.vercel.app', // frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, // agar cookie yoki auth kerak bo'lsa
  });

  // Swagger sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Anime API')
    .setDescription('UZKADUBBING Anime REST API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'JWT-auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/uzkadubbing', app, document);

  // Static files
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // ✅ Render-da portni ishlatish
  const PORT = process.env.PORT || 3000;
  await app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
bootstrap();
