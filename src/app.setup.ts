import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Shared between main.ts (production bootstrap) and e2e tests, so both run
// against the exact same global pipes/CORS/Swagger configuration.
export function configureApp(app: INestApplication): void {
  const configService = app.get(ConfigService);

  app.enableCors({ origin: configService.get<string>('app.corsOrigin') });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Vinted Reselling API')
    .setDescription(
      'API for managing purchases, sales, inventory and marketplace insights',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, swaggerDocument);
}
