import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Prefix global
  app.setGlobalPrefix('api/v1');

  // Validation globale
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // rejette les champs inconnus
      forbidNonWhitelisted: true,
      transform: true,       // cast automatique des types
    }),
  );

  // CORS
  app.enableCors({
    origin: [
      'http://localhost:3000', // BO Next.js local
      'https://backoffice.matinmidisoir.ci',
    ],
    credentials: true,
  });

  // Swagger Documentation
  const config = new DocumentBuilder()
    .setTitle('🍽 MMS API')
    .setDescription('API REST de la plateforme SaaS Matin Midi Soir — Restauration Collective B2B')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentification JWT + OTP')
    .addTag('Organisations', 'Gestion des entreprises clientes (multi-tenant)')
    .addTag('Users', 'Gestion des utilisateurs')
    .addTag('Dishes', 'Catalogue des plats')
    .addTag('Menus', 'Planification des menus')
    .addTag('Orders', 'Commandes + QR Code')
    .addTag('Payments', 'Paiements Mobile Money / Wallet')
    .addTag('Loyalty', 'Programme de fidélité')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  console.log(`\n🚀 MMS API démarrée sur: http://localhost:${port}/api/v1`);
  console.log(`📖 Documentation Swagger: http://localhost:${port}/docs\n`);
}
bootstrap();
