import { NestFactory } from '@nestjs/core';
import { UserModule } from './models/user.module';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { say } from 'cowsay';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  const configService = app.get(ConfigService);
  const PORT = configService.get<number>('PORT') || 3000;

  const options = new DocumentBuilder()
    .setTitle('User Microservice')
    .setDescription('User microservice for the social network app')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, (): void =>
    console.log(
      say({
        text: `Server listening on port http://localhost:${PORT}`,
        e: 'oO',
        T: 'U ',
      }),
    ),
  );
}
bootstrap();
