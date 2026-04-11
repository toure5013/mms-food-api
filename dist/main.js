"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'https://backoffice.matinmidisoir.ci',
        ],
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        swaggerOptions: { persistAuthorization: true },
    });
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`\n🚀 MMS API démarrée sur: http://localhost:${port}/api/v1`);
    console.log(`📖 Documentation Swagger: http://localhost:${port}/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map