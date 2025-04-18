import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    stopAtFirstError: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('English Vocabulary API')
    .setDescription('API for building English vocabulary collections')
    .setVersion('1.0') 
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: false
    },
  });

  await app.listen(3001, () => {
    console.log("SERVER IS RUNNING AT PORT 3001...");
    
  });
}
bootstrap();