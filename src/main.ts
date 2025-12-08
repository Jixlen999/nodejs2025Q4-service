import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { LoggingService } from './logging/logging.service';

const PORT = process.env.PORT ?? 4000;

async function bootstrap() {
  const logger = new LoggingService();

  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useLogger(logger);

  const config = new DocumentBuilder()
    .setTitle('Home Library Service')
    .setDescription('Home music library service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  writeFileSync('./doc/api.yaml', yaml.dump(document));

  SwaggerModule.setup('doc', app, document);

  await app.listen(PORT);

  console.log(`App started on port http://localhost:${PORT}`);
}
bootstrap();
