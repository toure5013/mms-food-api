"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const nest_winston_1 = require("nest-winston");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.useLogger(app.get(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER));
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('🍽 MMS API — Matin Midi Soir')
        .setDescription(`## Plateforme SaaS de Restauration Collective B2B

MMS API est le backend de la plateforme **Matin Midi Soir**, une solution SaaS dédiée à la gestion de cantines d'entreprise en Afrique de l'Ouest.

### Fonctionnalités clés
- 🔐 **Authentification** — JWT + OTP (première connexion / reset)
- 🏢 **Multi-tenant** — Chaque organisation a sa propre configuration (menus, subventions, branding)
- 🍲 **Catalogue de plats** — CRUD complet avec filtres nutritionnels et allergènes
- 📅 **Planification de menus** — Par date, créneau et organisation
- 🛒 **Commandes** — Création avec QR Code, suivi de statut en temps réel
- 💳 **Paiements** — Mobile Money (Wave, Orange Money), Wallet interne
- 💰 **Porte-monnaie** — Recharge et débit automatique
- 🔔 **Notifications** — Push (FCM), email, in-app
- ⭐ **Fidélité** — Points, historique et classement
- 📦 **Stockage** — Upload de fichiers vers MinIO (S3-compatible)

### Rôles utilisateurs
| Rôle | Description |
|------|-------------|
| \`SUPER_ADMIN\` | Administrateur global MMS (Backoffice Web) |
| \`ADMIN_MMS\` | Opérationnel MMS (Mobile terrain) |
| \`ADMIN_CLIENT\` | Administrateur entreprise cliente |
| \`EMPLOYEE\` | Employé (Application Mobile) |
| \`COOK\` | Cuisinier (Application Mobile) |
| \`PATIENT\` | Patient (Tablette) |
`)
        .setVersion('1.0.0')
        .setContact('Équipe MMS', 'https://matinmidisoir.ci', 'contact@matinmidisoir.ci')
        .setLicense('Propriétaire', 'https://matinmidisoir.ci/licence')
        .addBearerAuth({ type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Entrez votre token JWT' }, 'JWT-auth')
        .addServer(`http://localhost:${process.env.PORT ?? 3001}`, '🖥 Serveur Local (Développement)')
        .addTag('Auth', '🔐 Authentification JWT + OTP — Connexion, inscription, reset mot de passe')
        .addTag('Organisations', '🏢 Gestion multi-tenant des entreprises clientes (config menus, subventions, branding)')
        .addTag('Users', '👥 Gestion des utilisateurs — CRUD, invitation par email, rôles')
        .addTag('Dishes', '🍲 Catalogue des plats — CRUD, filtres nutritionnels, allergènes')
        .addTag('Menus', '📅 Planification des menus — Par date, créneau et organisation')
        .addTag('Orders', '🛒 Commandes — Création, QR Code, suivi de statut, retrait')
        .addTag('Payments', '💳 Paiements — Mobile Money (Wave, Orange Money), webhooks, remboursements')
        .addTag('Wallet', '💰 Porte-monnaie — Solde, recharge Mobile Money, débit, historique transactions')
        .addTag('Notifications', '🔔 Notifications — Push FCM, in-app, marquer comme lu, token management')
        .addTag('Loyalty', '⭐ Programme de fidélité — Points, historique, classement, utilisation')
        .addTag('Storage', '📦 Stockage fichiers — Upload images (plats, avatars, logos) vers MinIO')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'MMS API — Documentation',
        customfavIcon: 'https://matinmidisoir.ci/favicon.ico',
        customCss: `
      .swagger-ui .topbar { background-color: #1B1B1B; }
      .swagger-ui .topbar .download-url-wrapper .select-label { color: #fff; }
      .swagger-ui .info .title { font-size: 2.5em; }
    `,
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            tagsSorter: 'alpha',
            operationsSorter: 'method',
        },
    });
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`\n🚀 MMS API démarrée sur: http://localhost:${port}/api/v1`);
    console.log(`📖 Documentation Swagger: http://localhost:${port}/docs\n`);
}
bootstrap();
//# sourceMappingURL=main.js.map