-- =============================================================================
-- MMS CANTINE — Schéma initial complet + données seed
-- À exécuter UNE SEULE FOIS sur une base PostgreSQL vide via pgAdmin
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. TYPES ENUM
-- ---------------------------------------------------------------------------

CREATE TYPE "users_role_enum" AS ENUM (
  'SUPER_ADMIN','ADMIN_MMS','ADMIN_CLIENT','EMPLOYEE','COOK','PATIENT','SERVER'
);
CREATE TYPE "organisations_mode_gestion_menu_enum" AS ENUM ('AUTONOME','MMS');
CREATE TYPE "organisations_subvention_type_enum"   AS ENUM ('FIXED','PERCENTAGE','CAPPED','HYBRID','FULL');
CREATE TYPE "organisations_financial_mode_enum"    AS ENUM ('DEBT','WALLET');
CREATE TYPE "dishes_categorie_enum"                AS ENUM ('ENTREE','RESISTANCE','DESSERT','CAFE','BOISSON','COLLATION');
CREATE TYPE "menus_creneau_enum"                   AS ENUM ('MORNING','NOON','EVENING','SNACK');
CREATE TYPE "orders_statut_enum"                   AS ENUM ('PENDING','CONFIRMED','PAID','PREPARING','READY','RETRIEVED','CANCELLED');
CREATE TYPE "orders_creneau_enum"                  AS ENUM ('MORNING','NOON','EVENING','SNACK');
CREATE TYPE "orders_methode_paiement_enum"         AS ENUM ('WAVE','ORANGE_MONEY','MTN','CINETPAY','PAYDUNYA','WALLET','EMPLOYER');
CREATE TYPE "payments_methode_enum"                AS ENUM ('WAVE','ORANGE_MONEY','MTN','CINETPAY','PAYDUNYA','WALLET','EMPLOYER');
CREATE TYPE "payments_statut_enum"                 AS ENUM ('PENDING','SUCCESS','FAILED','REFUNDED');
CREATE TYPE "notifications_canal_enum"             AS ENUM ('PUSH','EMAIL','SMS');
CREATE TYPE "wallet_transactions_type_enum"        AS ENUM ('CREDIT','DEBIT');
CREATE TYPE "loyalty_transactions_type_enum"       AS ENUM ('EARNED','REDEEMED','EXPIRED','BONUS');

-- ---------------------------------------------------------------------------
-- 2. TABLES
-- ---------------------------------------------------------------------------

CREATE TABLE "settings" (
  "id"          SERIAL    NOT NULL,
  "general"     jsonb,
  "branding"    jsonb,
  "notifs"      jsonb,
  "security"    jsonb,
  "org"         jsonb,
  "dietary"     jsonb,
  "features"    jsonb,
  "created_at"  TIMESTAMP NOT NULL DEFAULT now(),
  "updated_at"  TIMESTAMP NOT NULL DEFAULT now(),
  CONSTRAINT "PK_settings" PRIMARY KEY ("id")
);

CREATE TABLE "organisations" (
  "id"                         uuid          NOT NULL DEFAULT gen_random_uuid(),
  "slug"                       varchar       NOT NULL,
  "nom"                        varchar       NOT NULL,
  "logo_url"                   varchar,
  "couleur_primaire"           varchar       NOT NULL DEFAULT '#E87722',
  "couleur_secondaire"         varchar       NOT NULL DEFAULT '#1A1A2E',
  "mode_gestion_menu"          "organisations_mode_gestion_menu_enum" NOT NULL DEFAULT 'MMS',
  "subvention_type"            "organisations_subvention_type_enum"   NOT NULL DEFAULT 'FIXED',
  "financial_mode"             "organisations_financial_mode_enum"    NOT NULL DEFAULT 'DEBT',
  "subvention_valeur"          numeric(10,2) NOT NULL DEFAULT 0,
  "subvention_plafond_mensuel" numeric(10,2),
  "is_active"                  boolean       NOT NULL DEFAULT true,
  "prix_min_plats"             numeric(10,2) NOT NULL DEFAULT 0,
  "prix_max_plats"             numeric(10,2) NOT NULL DEFAULT 0,
  "prix_max_menu"              numeric(10,2) NOT NULL DEFAULT 0,
  "is_guest_order_enabled"     boolean       NOT NULL DEFAULT false,
  "guest_config"               jsonb,
  "guest_order_start_time"     varchar,
  "guest_order_end_time"       varchar,
  "order_day_offset"           integer       NOT NULL DEFAULT 0,
  "created_at"                 TIMESTAMP     NOT NULL DEFAULT now(),
  "updated_at"                 TIMESTAMP     NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_organisations_slug" UNIQUE ("slug"),
  CONSTRAINT "PK_organisations"      PRIMARY KEY ("id")
);

CREATE TABLE "users" (
  "id"                 uuid              NOT NULL DEFAULT gen_random_uuid(),
  "prenom"             varchar           NOT NULL,
  "nom"                varchar           NOT NULL,
  "email"              varchar           NOT NULL,
  "password_hash"      varchar,
  "role"               "users_role_enum" NOT NULL,
  "telephone"          varchar,
  "avatar_url"         varchar,
  "service"            varchar,
  "regimes"            text,
  "allergies"          text,
  "otp_code"           varchar,
  "otp_expires_at"     TIMESTAMP,
  "loyalty_points"     integer           NOT NULL DEFAULT 0,
  "loyalty_expires_at" TIMESTAMP,
  "fcm_token"          varchar,
  "is_active"          boolean           NOT NULL DEFAULT true,
  "is_first_login"     boolean           NOT NULL DEFAULT false,
  "organisation_id"    uuid,
  "created_at"         TIMESTAMP         NOT NULL DEFAULT now(),
  "updated_at"         TIMESTAMP         NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_users_email" UNIQUE ("email"),
  CONSTRAINT "PK_users"       PRIMARY KEY ("id"),
  CONSTRAINT "FK_users_organisation" FOREIGN KEY ("organisation_id")
    REFERENCES "organisations"("id") ON DELETE SET NULL
);

CREATE TABLE "dishes" (
  "id"              uuid                   NOT NULL DEFAULT gen_random_uuid(),
  "nom"             varchar                NOT NULL,
  "description"     varchar,
  "photo_url"       varchar,
  "categorie"       "dishes_categorie_enum",
  "prix"            numeric(10,2)          NOT NULL,
  "sans_sel"        boolean                NOT NULL DEFAULT false,
  "sans_gras"       boolean                NOT NULL DEFAULT false,
  "sans_sucre"      boolean                NOT NULL DEFAULT false,
  "sans_huile"      boolean                NOT NULL DEFAULT false,
  "vegetarien"      boolean                NOT NULL DEFAULT false,
  "halal"           boolean                NOT NULL DEFAULT false,
  "allergenes"      text,
  "organisation_id" uuid,
  "is_active"       boolean                NOT NULL DEFAULT true,
  "created_at"      TIMESTAMP              NOT NULL DEFAULT now(),
  "updated_at"      TIMESTAMP              NOT NULL DEFAULT now(),
  CONSTRAINT "PK_dishes"              PRIMARY KEY ("id"),
  CONSTRAINT "FK_dishes_organisation" FOREIGN KEY ("organisation_id")
    REFERENCES "organisations"("id") ON DELETE CASCADE
);
CREATE INDEX "IDX_dishes_organisation_id" ON "dishes" ("organisation_id");

CREATE TABLE "menus" (
  "id"                 uuid                 NOT NULL DEFAULT gen_random_uuid(),
  "date"               date                 NOT NULL,
  "creneau"            "menus_creneau_enum" NOT NULL,
  "is_published"       boolean              NOT NULL DEFAULT false,
  "photo_url"          varchar,
  "published_at"       TIMESTAMP,
  "publication_limite" TIMESTAMP,
  "organisation_id"    uuid                 NOT NULL,
  "created_at"         TIMESTAMP            NOT NULL DEFAULT now(),
  "updated_at"         TIMESTAMP            NOT NULL DEFAULT now(),
  CONSTRAINT "PK_menus"              PRIMARY KEY ("id"),
  CONSTRAINT "FK_menus_organisation" FOREIGN KEY ("organisation_id")
    REFERENCES "organisations"("id") ON DELETE CASCADE
);

-- ATTENTION : colonnes camelCase — c'est ce que TypeORM génère réellement
CREATE TABLE "menu_dishes" (
  "menusId"  uuid NOT NULL,
  "dishesId" uuid NOT NULL,
  CONSTRAINT "PK_menu_dishes"      PRIMARY KEY ("menusId", "dishesId"),
  CONSTRAINT "FK_menu_dishes_menu" FOREIGN KEY ("menusId")
    REFERENCES "menus"("id")  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_menu_dishes_dish" FOREIGN KEY ("dishesId")
    REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IDX_menu_dishes_menusId"  ON "menu_dishes" ("menusId");
CREATE INDEX "IDX_menu_dishes_dishesId" ON "menu_dishes" ("dishesId");

CREATE TABLE "orders" (
  "id"                 uuid                          NOT NULL DEFAULT gen_random_uuid(),
  "numero_commande"    varchar                       NOT NULL,
  "qr_code_token"      varchar                       NOT NULL,
  "statut"             "orders_statut_enum"          NOT NULL DEFAULT 'PENDING',
  "creneau"            "orders_creneau_enum"         NOT NULL,
  "date_livraison"     date                          NOT NULL,
  "montant_total"      numeric(10,2)                 NOT NULL,
  "montant_subvention" numeric(10,2)                 NOT NULL DEFAULT 0,
  "montant_employe"    numeric(10,2)                 NOT NULL DEFAULT 0,
  "methode_paiement"   "orders_methode_paiement_enum",
  "points_gagnes"      integer                       NOT NULL DEFAULT 0,
  "date_recuperation"  TIMESTAMP,
  "recupere_par"       varchar,
  "is_guest"           boolean                       NOT NULL DEFAULT false,
  "guest_info"         jsonb,
  "employe_id"         uuid,
  "organisation_id"    uuid                          NOT NULL,
  "created_at"         TIMESTAMP                     NOT NULL DEFAULT now(),
  "updated_at"         TIMESTAMP                     NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_orders_numero_commande" UNIQUE ("numero_commande"),
  CONSTRAINT "UQ_orders_qr_code_token"   UNIQUE ("qr_code_token"),
  CONSTRAINT "PK_orders"                 PRIMARY KEY ("id"),
  CONSTRAINT "FK_orders_employe"         FOREIGN KEY ("employe_id")
    REFERENCES "users"("id")         ON DELETE SET NULL,
  CONSTRAINT "FK_orders_organisation"    FOREIGN KEY ("organisation_id")
    REFERENCES "organisations"("id") ON DELETE CASCADE
);

-- ATTENTION : colonnes camelCase
CREATE TABLE "order_dishes" (
  "ordersId" uuid NOT NULL,
  "dishesId" uuid NOT NULL,
  CONSTRAINT "PK_order_dishes"       PRIMARY KEY ("ordersId", "dishesId"),
  CONSTRAINT "FK_order_dishes_order" FOREIGN KEY ("ordersId")
    REFERENCES "orders"("id")  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_order_dishes_dish"  FOREIGN KEY ("dishesId")
    REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "IDX_order_dishes_ordersId" ON "order_dishes" ("ordersId");
CREATE INDEX "IDX_order_dishes_dishesId" ON "order_dishes" ("dishesId");

CREATE TABLE "payments" (
  "id"                      uuid                    NOT NULL DEFAULT gen_random_uuid(),
  "reference"               varchar                 NOT NULL,
  "methode"                 "payments_methode_enum" NOT NULL,
  "statut"                  "payments_statut_enum"  NOT NULL DEFAULT 'PENDING',
  "montant"                 numeric(10,2)           NOT NULL,
  "telephone"               varchar,
  "provider_transaction_id" varchar,
  "provider_response"       varchar,
  "error_message"           varchar,
  "order_id"                uuid                    NOT NULL,
  "user_id"                 uuid                    NOT NULL,
  "created_at"              TIMESTAMP               NOT NULL DEFAULT now(),
  "updated_at"              TIMESTAMP               NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_payments_reference" UNIQUE ("reference"),
  CONSTRAINT "PK_payments"           PRIMARY KEY ("id"),
  CONSTRAINT "FK_payments_order"     FOREIGN KEY ("order_id")
    REFERENCES "orders"("id") ON DELETE CASCADE,
  CONSTRAINT "FK_payments_user"      FOREIGN KEY ("user_id")
    REFERENCES "users"("id")  ON DELETE CASCADE
);

CREATE TABLE "wallets" (
  "id"         uuid          NOT NULL DEFAULT gen_random_uuid(),
  "solde"      numeric(10,2) NOT NULL DEFAULT 0,
  "is_active"  boolean       NOT NULL DEFAULT true,
  "user_id"    uuid          NOT NULL,
  "created_at" TIMESTAMP     NOT NULL DEFAULT now(),
  "updated_at" TIMESTAMP     NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_wallets_user_id" UNIQUE ("user_id"),
  CONSTRAINT "PK_wallets"         PRIMARY KEY ("id"),
  CONSTRAINT "FK_wallets_user"    FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "wallet_transactions" (
  "id"          uuid                            NOT NULL DEFAULT gen_random_uuid(),
  "type"        "wallet_transactions_type_enum" NOT NULL,
  "montant"     numeric(10,2)                   NOT NULL,
  "solde_apres" numeric(10,2)                   NOT NULL,
  "description" varchar,
  "reference"   varchar,
  "wallet_id"   uuid                            NOT NULL,
  "created_at"  TIMESTAMP                       NOT NULL DEFAULT now(),
  CONSTRAINT "PK_wallet_transactions"        PRIMARY KEY ("id"),
  CONSTRAINT "FK_wallet_transactions_wallet" FOREIGN KEY ("wallet_id")
    REFERENCES "wallets"("id") ON DELETE CASCADE
);

CREATE TABLE "notifications" (
  "id"         uuid                       NOT NULL DEFAULT gen_random_uuid(),
  "titre"      varchar                    NOT NULL,
  "message"    text                       NOT NULL,
  "canal"      "notifications_canal_enum" NOT NULL DEFAULT 'PUSH',
  "is_read"    boolean                    NOT NULL DEFAULT false,
  "read_at"    TIMESTAMP,
  "action_url" varchar,
  "metadata"   varchar,
  "user_id"    uuid                       NOT NULL,
  "created_at" TIMESTAMP                  NOT NULL DEFAULT now(),
  CONSTRAINT "PK_notifications"      PRIMARY KEY ("id"),
  CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE
);

CREATE TABLE "loyalty_transactions" (
  "id"          uuid                             NOT NULL DEFAULT gen_random_uuid(),
  "type"        "loyalty_transactions_type_enum" NOT NULL,
  "points"      integer                          NOT NULL,
  "description" varchar,
  "reference"   varchar,
  "user_id"     uuid                             NOT NULL,
  "created_at"  TIMESTAMP                        NOT NULL DEFAULT now(),
  CONSTRAINT "PK_loyalty_transactions"      PRIMARY KEY ("id"),
  CONSTRAINT "FK_loyalty_transactions_user" FOREIGN KEY ("user_id")
    REFERENCES "users"("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 3. DONNÉES SEED
-- ---------------------------------------------------------------------------

-- settings
INSERT INTO "settings" (id, general, branding, notifs, security, org, dietary, features, created_at, updated_at)
VALUES (1,
  '{"phone":"+225 27 XX XX XX XX","currency":"FCFA (XOF)","timezone":"Africa/Abidjan","contactEmail":"admin@mms.ci","platformName":"MMS — Matin Midi Soir"}',
  '{"logoUrl":"https://mms.ci/logo.png","displayName":"MMS Admin","primaryColor":"#002ad9"}',
  '{"lowStock":true,"dailyReport":true,"lateDelivery":true,"paymentFailed":true,"newRegistration":true}',
  '{"auditLogs":true,"autoLogout":false,"jwtExpiration":"7d","twoFactorAuth":true}',
  '{"rccm":"CI-ABJ-2024-B-12345","address":"Cocody, Abidjan, Côte d''Ivoire","companyName":"Matin Midi Soir SARL","noonService":"11:30 – 14:00","eveningService":"18:00 – 21:00","morningService":"07:00 – 10:00"}',
  '{"customAllergies":[],"customRegimes":[]}',
  '{"otpRequired":true,"paymentRequired":true}',
  '2026-04-20 22:40:08.168847', '2026-04-21 10:30:00.9'
);
SELECT pg_catalog.setval('settings_id_seq', 1, true);

-- organisations
INSERT INTO "organisations" (id, slug, nom, logo_url, couleur_primaire, couleur_secondaire, mode_gestion_menu, subvention_type, subvention_valeur, subvention_plafond_mensuel, is_active, prix_min_plats, prix_max_plats, prix_max_menu, financial_mode, is_guest_order_enabled, guest_config, guest_order_start_time, guest_order_end_time, order_day_offset, created_at, updated_at) VALUES
('b0f44923-3897-4f11-923f-4e5659b897e1','orange-ci','Orange Côte d''Ivoire',NULL,'#FF7900','#000000','MMS','PERCENTAGE',50.00,NULL,true,0,0,0,'DEBT',false,NULL,NULL,NULL,0,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('b0f44923-3897-4f11-923f-4e5659b897e4','cie-sodeci','CIE-SODECI',NULL,'#003366','#FFFFFF','MMS','FULL',10000.00,NULL,true,0,10000,10000,'DEBT',false,NULL,NULL,NULL,0,'2026-04-11 19:03:41.863629','2026-04-21 20:30:08.927241'),
('b0f44923-3897-4f11-923f-4e5659b897e2','nsia-banque','NSIA Banque',NULL,'#004A99','#D4AF37','MMS','FIXED',1500.00,NULL,true,0,0,0,'DEBT',true,'{"fields":[{"id":"1777291410821","type":"text","label":"Nom ","required":true},{"id":"1777291418077","type":"text","label":"Prénom","required":true},{"id":"1777291422622","type":"text","label":"Numéro de téléphone","required":true},{"id":"1777291432596","type":"text","label":"Numéro de chambre","required":true}]}','00:00','23:59',0,'2026-04-11 19:03:41.863629','2026-04-27 12:03:58.502472'),
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11','demo-sarl','Entreprise Demo SARL',NULL,'#E87722','#1A1A2E','MMS','FIXED',10000.00,NULL,true,10,10000,10000,'DEBT',true,'{"fields":[{"id":"1777300680856","type":"text","label":"Nom","required":true},{"id":"1777300683614","type":"text","label":"Numéro de téléphone","required":true},{"id":"1777300691073","type":"text","label":"Numéro de chambre","required":true}]}','00:00','23:59',0,'2026-04-11 20:09:38.851313','2026-04-27 14:38:32.105305'),
('f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b','togoom-corp','TOGOOM CORP',NULL,'#FF6B00','#1A1A2E','MMS','FIXED',10000.00,NULL,true,0,10000,10000,'DEBT',true,'{"fields":[{"id":"1777290969431","type":"text","label":"Nom","required":true},{"id":"1777290973966","type":"text","label":"Numéro de téléphone","required":true},{"id":"1777290984032","type":"text","label":"Chambre","required":true}]}','08:00','20:00',0,'2026-04-21 12:04:45.759261','2026-04-27 16:32:59.445203');

-- users  (mot de passe = "password" bcrypt)
INSERT INTO "users" (id, prenom, nom, email, password_hash, role, telephone, avatar_url, service, otp_code, otp_expires_at, loyalty_points, loyalty_expires_at, fcm_token, is_active, is_first_login, organisation_id, created_at, updated_at, regimes, allergies) VALUES
('00000000-0000-0000-0000-000000000001','Super','Admin','admin@super.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','SUPER_ADMIN','','','',NULL,NULL,0,NULL,NULL,true,false,NULL,'2026-04-11 17:42:51.074632','2026-04-21 12:09:37.457279',NULL,NULL),
('44444444-4444-4444-4444-444444444444','Moussa','Serveur','moussa.serveur@tog.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','ADMIN_MMS','','','',NULL,NULL,0,NULL,NULL,true,false,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b','2026-04-11 20:09:38.851313','2026-04-21 12:09:19.004756',NULL,NULL),
('11111111-1111-1111-1111-111111111111','Jean','Cuisinier','chef@mms.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','COOK',NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,true,false,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b','2026-04-11 20:09:38.851313','2026-04-11 20:09:38.851313',NULL,NULL),
('22222222-2222-2222-2222-222222222222','Fatou','Admin','admin@demo.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','ADMIN_CLIENT',NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,true,false,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11','2026-04-11 20:09:38.851313','2026-04-11 20:09:38.851313',NULL,NULL),
('33333333-3333-3333-3333-333333333333','Koffi','Salarié','koffi@demo.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','EMPLOYEE',NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,true,false,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11','2026-04-11 20:09:38.851313','2026-04-11 20:09:38.851313',NULL,NULL),
('33333333-3333-3333-3333-333333333334','Koffi','Salarié','koff@demo.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','EMPLOYEE',NULL,NULL,NULL,NULL,NULL,50,NULL,NULL,true,false,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11','2026-04-11 20:44:46.760597','2026-04-11 20:44:46.760597',NULL,NULL),
('8d9e5f6f-a7cb-463b-9721-a123cf1815a6','Awa','Koné','awa@nsia.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','ADMIN_CLIENT',NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,true,false,'b0f44923-3897-4f11-923f-4e5659b897e2','2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629',NULL,NULL),
('63264bfa-cfa8-4276-8e77-a806e73c0a31','Koffi','Kouassi','koffi@orange.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','EMPLOYEE',NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,true,false,'b0f44923-3897-4f11-923f-4e5659b897e1','2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629',NULL,NULL),
('77b7f4e0-5f5e-4948-be5a-9eea69b4e991','ADMI','SIMPLE','admin1@org.com','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','EMPLOYEE','','','',NULL,NULL,0,NULL,NULL,true,false,'b0f44923-3897-4f11-923f-4e5659b897e1','2026-04-20 18:19:01.440773','2026-04-20 18:19:01.440773',NULL,NULL),
('f965ff2d-526c-4a25-96a2-65d761f8c282','Tog','TOGOOM','admin@tog.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','ADMIN_CLIENT','+225 0708000000',NULL,NULL,NULL,NULL,0,NULL,NULL,true,false,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b','2026-04-21 12:04:45.791637','2026-04-21 12:04:45.791637',NULL,NULL),
('00000000-0000-0000-0000-000000000002','AMIN','KADIM','amin@demo.ci','$2b$12$rzwb0yG2K2rM8rEnUgP/8.nt60GU4ZxD.rleGcHlbXA7H0e51PyS2','EMPLOYEE',NULL,NULL,NULL,NULL,NULL,0,NULL,NULL,true,false,NULL,'2026-04-22 09:13:47.762511','2026-04-22 09:13:47.762511',NULL,NULL);

-- dishes
INSERT INTO "dishes" (id, nom, description, photo_url, prix, sans_sel, sans_gras, sans_sucre, sans_huile, vegetarien, halal, allergenes, organisation_id, is_active, categorie, created_at, updated_at) VALUES
('dfc63043-c855-4cdf-8a2f-5cded613766d','Attiéké Poisson Grillé','Poisson carpe ou thon grillé avec attiéké frais et piment',NULL,2500,false,false,false,false,false,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78','Foutou Banane Sauce Graine','Foutou banane pilonné avec sauce graine riche en viande de brousse',NULL,3500,false,false,false,false,false,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('8224f627-d251-4878-9212-8bace8f01db6','Garba Royal','Attiéké de qualité supérieure avec thon frit croustillant',NULL,1500,false,false,false,false,false,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('226bc708-130a-490c-8232-d5f696f50e9c','Poulet Braisé','Demi-poulet braisé aux épices locales servi avec alloco',NULL,4500,false,false,false,false,false,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('78f6afd2-3d2b-4396-aade-87777de434d3','Salade de Crudités','Mélange de tomates, carottes, oignons et concombres frais',NULL,1500,true,true,false,false,true,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('b6359355-ef13-469f-8fad-dc11d659a93a','Brochettes de Filet de Bœuf','3 brochettes de bœuf tendres servies avec frites',NULL,3000,false,false,false,false,false,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('3259bd25-4a2d-46c5-bdbd-0b227503779e','Bissap Rouge','Jus d''oseille de Guinée Bio',NULL,500,true,true,false,false,true,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('ec31694f-6ae8-4006-a5c9-64ba4e789fa2','Gnonmi','Petits beignets de mil fermenté au gingembre',NULL,500,false,false,false,false,true,true,NULL,NULL,true,NULL,'2026-04-11 19:03:41.863629','2026-04-11 19:03:41.863629'),
('62b8f515-b59e-47b9-a056-41cb0eaef77a','Salade composée','Salade fraîche avec légumes variés','',2500,false,true,true,true,true,true,'aucun',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('1f270045-2a76-4062-ad4f-a23c84a7afa1','Avocat crevettes','Avocat farci aux crevettes','',4000,false,false,true,false,false,true,'crustacés',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('7ba9ce70-096b-436b-8987-911498799ab4','Salade de fruits','Mix de fruits frais','',2000,true,true,true,true,true,true,'aucun',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('6a287851-857e-4ec8-816a-dd9be9fe3116','Carottes râpées','Carottes fraîches râpées','',1500,true,true,true,true,true,true,'aucun',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('3cf7d792-57db-4d7a-8c6b-e103d655c21c','Taboulé','Semoule et légumes','',2500,false,true,true,true,true,true,'gluten',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('b8efdf1b-ea1e-4625-ac8f-811b96b319b3','Salade de thon','Salade avec thon','',3000,false,false,true,false,false,true,'poisson',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('a4493300-70f3-4872-a4c6-83bd6035a700','Soupe de légumes','Soupe chaude maison','',2000,true,true,true,true,true,true,'aucun',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('d7280cf7-95f0-4ef8-a79e-d6da36eb7953','Salade grecque','Tomate, feta, olive','',3000,false,false,true,false,true,true,'lactose',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('0b092c6e-e7b8-4daf-abe0-bfdcb11d0326','Pastels','Beignets farcis','',2500,false,false,false,false,false,true,'gluten',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('9fa42c00-b56c-4097-9a0c-10fcb646daaa','Samoussas','Triangles croustillants','',2500,false,false,false,false,false,true,'gluten',NULL,true,'ENTREE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('0a1c6e47-78c3-44c4-9f5a-285b19ba829c','Riz gras poulet','Riz africain avec poulet','',4000,false,false,false,false,false,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('f160775f-add2-41b7-b608-87600c64886a','Attiéké poisson','Attiéké avec poisson braisé','',3500,false,false,false,false,false,true,'poisson',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('41a0f45d-11a4-4efc-acf5-d27817c46c3c','Garba','Attiéké + thon + piment','',2000,false,false,false,false,false,true,'poisson',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('58fc37e2-d3bf-4926-886d-f0ad6305c3d3','Poulet braisé','Poulet grillé africain','',5000,false,false,true,false,false,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('f9d240e8-9251-42e6-acb8-895ba0815fc6','Alloco poulet','Banane frite + poulet','',3500,false,false,false,false,false,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('1f99f68c-e9e9-4ce6-8375-bc2653c009a2','Riz sauce arachide','Riz avec sauce graine','',3000,false,false,false,false,false,true,'arachide',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('7a086b4c-4486-4f1a-8245-fa22bbc4c183','Spaghetti bolognaise','Pâtes avec viande','',3500,false,false,false,false,false,true,'gluten',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('98da3cb5-4f7f-4fdb-9dae-45a96a74c098','Poisson braisé','Poisson grillé','',4000,false,false,true,false,false,true,'poisson',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('e6d48da4-e129-4eeb-8d41-4ec4548d71a1','Riz blanc sauce feuille','Riz avec sauce africaine','',3000,false,false,false,false,true,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('240f4f16-3543-4b34-8857-e7d44cd4d1a0','Tchep poulet','Riz sénégalais','',4500,false,false,false,false,false,true,'poisson',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('c9c2e41a-458a-4e95-8fdd-fa51b0551c45','Riz cantonais','Riz sauté asiatique','',4000,false,false,false,false,false,true,'oeuf',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('7e00741f-427d-4224-844f-c7a5b8c328dd','Burger','Burger viande','',4500,false,false,false,false,false,true,'gluten',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('1dfe37b8-3297-48bf-ae30-77c289d68ab1','Pizza margherita','Pizza tomate fromage','',5000,false,false,false,false,true,true,'gluten,lactose',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('c50f9eb1-5d2c-4d3a-8b5f-4416c5a1a1a3','Poulet curry','Poulet sauce curry','',4000,false,false,false,false,false,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('992de5be-1144-48ca-b236-1708b46adfad','Riz sauté légumes','Riz végétarien','',3000,true,true,true,true,true,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('44cc8891-ef34-41e0-a2e5-620ca53594cf','Grillades mixtes','Viandes grillées','',6000,false,false,true,false,false,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('909fd31b-dbce-4556-bf6f-4142109e02e4','Yassa poulet','Poulet oignon citron','',4000,false,false,false,false,false,true,'aucun',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('53ac078f-dac9-4a93-99cc-1dcc751a98d2','Foutou sauce graine','Plat ivoirien','',3500,false,false,false,false,false,true,'arachide',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('6e38025e-ac56-4a6a-adb0-5a70ad140630','Placali sauce claire','Placali + sauce poisson','',3000,false,false,false,false,false,true,'poisson',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('d00d9da3-f68a-4d92-b8ce-c0386755293b','Omelette légumes','Omelette maison','',2500,true,true,true,true,true,true,'oeuf',NULL,true,'RESISTANCE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('d3a98f34-78c9-427e-8150-48664495e151','Tiramisu','Dessert italien','',3000,false,false,false,false,false,true,'lactose',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('c88e6123-9c63-4f2b-b7ed-41f31046e52a','Salade de fruits','Fruits frais','',2000,true,true,true,true,true,true,'aucun',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('925fef5f-684f-42e7-9bd9-3d6b91c6102f','Glace vanille','Glace douce','',1500,false,false,false,false,true,true,'lactose',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('0e147599-c83f-4c10-a0d2-4b8277aa1520','Crêpes','Crêpes sucrées','',2000,false,false,false,false,true,true,'gluten',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('1740052c-c9e9-4730-a2b1-e550ca2d6f43','Gâteau chocolat','Dessert chocolat','',2500,false,false,false,false,true,true,'gluten',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('6e4998dc-94ad-4e36-8e0e-e4e4a08e164c','Yaourt nature','Yaourt frais','',1000,true,true,true,true,true,true,'lactose',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('d547bc27-fb27-4b87-a839-ff236c10d1e7','Flan','Dessert léger','',1500,false,false,false,false,true,true,'oeuf',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('c89af083-9dbe-4df0-a84e-1c488ece329d','Beignets sucrés','Dessert africain','',1500,false,false,false,false,true,true,'gluten',NULL,true,'DESSERT','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('da006819-7974-4154-99c4-518cff7c8588','Jus d''orange','Jus naturel','',1500,true,true,true,true,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('797ece9e-1bb0-42d9-b8b7-623953119902','Jus de bissap','Boisson locale','',1000,true,true,true,true,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('4aefedd4-a855-4b77-83e3-1b237d98960f','Jus de gingembre','Boisson épicée','',1000,true,true,true,true,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('dd901f63-58c9-4d47-ab0a-d66bd5a7813c','Coca-Cola','Soda','',1000,false,false,false,false,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('eeb8cec7-c167-4e2d-b092-638ecdb637ce','Eau minérale','Eau','',500,true,true,true,true,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('3d3df6ea-d93d-4d52-b932-bd33b2b93133','Smoothie mangue','Boisson fruitée','',2000,true,true,true,true,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('e9308d1a-7ece-4e08-b6eb-8b931590b028','Cocktail fruits','Mix jus','',2000,true,true,true,true,true,true,'aucun',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('a6ca22cc-171c-4e82-9da4-0f76973f3d50','Lait frais','Boisson lactée','',1000,true,false,true,true,true,true,'lactose',NULL,true,'BOISSON','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('dba6a6b7-02f3-41fa-b3e0-3671042134f7','Espresso','Café serré','',1000,true,true,true,true,true,true,'aucun',NULL,true,'CAFE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('b6222b9f-93ce-492d-97c7-cd4165912804','Café latte','Café au lait','',1500,true,false,true,true,true,true,'lactose',NULL,true,'CAFE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('caeafe4f-fce0-4a4e-97e6-3ad857dcaa95','Cappuccino','Café mousseux','',1500,true,false,true,true,true,true,'lactose',NULL,true,'CAFE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432'),
('d8bc176b-79dd-4d15-938d-48474984d023','Thé','Boisson chaude','',1000,true,true,true,true,true,true,'aucun',NULL,true,'CAFE','2026-04-22 09:25:04.119432','2026-04-22 09:25:04.119432');

-- menus
INSERT INTO "menus" (id, date, creneau, is_published, published_at, publication_limite, organisation_id, photo_url, created_at, updated_at) VALUES
('ee7396f9-8e62-46d0-ad48-222a134f61b2','2026-04-15','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:15.116742','2026-04-21 20:56:15.116742'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','2026-04-15','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:15.137667','2026-04-21 20:56:15.137667'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','2026-04-15','EVENING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:15.14946','2026-04-21 20:56:15.14946'),
('6f041b47-c0e0-4fe3-bfed-e14a58afc3ec','2026-04-21','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:28.873711','2026-04-21 20:56:28.873711'),
('21115772-f24a-4da2-8038-bb0a1c63eb28','2026-04-16','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:54.79714','2026-04-21 20:56:54.79714'),
('cdb4a201-71ac-4d40-8ccd-fca139017bd5','2026-04-16','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:54.814352','2026-04-21 20:56:54.814352'),
('8fb38991-d066-4d4f-a092-29fd946e1a0e','2026-04-16','EVENING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 20:56:54.823128','2026-04-21 20:56:54.823128'),
('a7e57939-95ca-4ba3-83fe-90fca79de9fa','2026-04-21','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:21:06.97657','2026-04-21 21:21:06.97657'),
('d34398db-33a3-4170-87b7-fad9564eecfe','2026-04-22','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:21:29.391243','2026-04-21 21:21:29.391243'),
('1a4584c6-0b22-4b5e-85f4-130093570825','2026-04-22','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:21:29.404256','2026-04-21 21:21:29.404256'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','2026-04-22','EVENING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:21:29.41166','2026-04-21 21:21:29.41166'),
('98862972-4eb3-4c16-927a-ff4df177036e','2026-04-23','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:22:06.421639','2026-04-21 21:22:06.421639'),
('9bc3f113-a5bd-4b3d-8457-90c335705ef5','2026-04-23','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:22:06.438969','2026-04-21 21:22:06.438969'),
('8ce151db-219d-4af3-a2f7-5c030dd5a866','2026-04-23','EVENING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-21 21:22:06.450347','2026-04-21 21:22:06.450347'),
('533fb89c-d4af-416c-b029-7ff2f4a7e981','2026-04-24','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-22 08:27:57.0646','2026-04-22 08:27:57.0646'),
('0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3','2026-04-29','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-22 11:37:55.868812','2026-04-22 11:37:55.868812'),
('9537b69f-33bd-4980-9163-67109ba591ab','2026-04-27','MORNING',false,NULL,NULL,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',NULL,'2026-04-27 12:11:14.990076','2026-04-27 12:11:14.990076'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','2026-04-27','NOON',false,NULL,NULL,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',NULL,'2026-04-27 12:11:15.011861','2026-04-27 12:11:15.011861'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','2026-04-27','EVENING',false,NULL,NULL,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',NULL,'2026-04-27 12:11:15.019503','2026-04-27 12:11:15.019503'),
('49e80d54-467d-48d0-a767-95aebe17d137','2026-04-27','SNACK',false,NULL,NULL,'f51ac2c8-6dc0-487c-b3ed-f4dd937b7e8b',NULL,'2026-04-27 12:11:15.02717','2026-04-27 12:11:15.02717'),
('98751ac0-98bc-443f-be05-17f03c42101a','2026-04-27','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 13:10:06.29965','2026-04-27 13:10:06.29965'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','2026-04-27','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 13:10:23.922431','2026-04-27 13:10:23.922431'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','2026-04-27','EVENING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 13:10:23.931277','2026-04-27 13:10:23.931277'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','2026-04-28','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 13:11:07.807718','2026-04-27 13:11:07.807718'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','2026-04-28','NOON',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 13:11:07.820207','2026-04-27 13:11:07.820207'),
('52436803-42cf-419a-a380-f1578fc3c1a9','2026-04-28','EVENING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 13:11:07.832253','2026-04-27 13:11:07.832253'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','2026-04-29','MORNING',false,NULL,NULL,'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',NULL,'2026-04-27 16:34:58.690454','2026-04-27 16:34:58.690454');

-- menu_dishes  (colonnes camelCase !)
INSERT INTO "menu_dishes" ("menusId","dishesId") VALUES
('ee7396f9-8e62-46d0-ad48-222a134f61b2','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('ee7396f9-8e62-46d0-ad48-222a134f61b2','8224f627-d251-4878-9212-8bace8f01db6'),
('ee7396f9-8e62-46d0-ad48-222a134f61b2','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('ee7396f9-8e62-46d0-ad48-222a134f61b2','62b8f515-b59e-47b9-a056-41cb0eaef77a'),
('ee7396f9-8e62-46d0-ad48-222a134f61b2','0b092c6e-e7b8-4daf-abe0-bfdcb11d0326'),
('ee7396f9-8e62-46d0-ad48-222a134f61b2','9fa42c00-b56c-4097-9a0c-10fcb646daaa'),
('ee7396f9-8e62-46d0-ad48-222a134f61b2','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','8224f627-d251-4878-9212-8bace8f01db6'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','226bc708-130a-490c-8232-d5f696f50e9c'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','78f6afd2-3d2b-4396-aade-87777de434d3'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','b6359355-ef13-469f-8fad-dc11d659a93a'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','3259bd25-4a2d-46c5-bdbd-0b227503779e'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','9fa42c00-b56c-4097-9a0c-10fcb646daaa'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','7e00741f-427d-4224-844f-c7a5b8c328dd'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','da006819-7974-4154-99c4-518cff7c8588'),
('9e5ab909-ca8c-4f08-8a03-c578a8ed79a2','4aefedd4-a855-4b77-83e3-1b237d98960f'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','8224f627-d251-4878-9212-8bace8f01db6'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','b6359355-ef13-469f-8fad-dc11d659a93a'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','b8efdf1b-ea1e-4625-ac8f-811b96b319b3'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','41a0f45d-11a4-4efc-acf5-d27817c46c3c'),
('3bae2a14-bc15-4c1a-813c-e80a7c22e981','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('6f041b47-c0e0-4fe3-bfed-e14a58afc3ec','8224f627-d251-4878-9212-8bace8f01db6'),
('6f041b47-c0e0-4fe3-bfed-e14a58afc3ec','226bc708-130a-490c-8232-d5f696f50e9c'),
('6f041b47-c0e0-4fe3-bfed-e14a58afc3ec','78f6afd2-3d2b-4396-aade-87777de434d3'),
('6f041b47-c0e0-4fe3-bfed-e14a58afc3ec','b6359355-ef13-469f-8fad-dc11d659a93a'),
('6f041b47-c0e0-4fe3-bfed-e14a58afc3ec','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('21115772-f24a-4da2-8038-bb0a1c63eb28','226bc708-130a-490c-8232-d5f696f50e9c'),
('21115772-f24a-4da2-8038-bb0a1c63eb28','78f6afd2-3d2b-4396-aade-87777de434d3'),
('21115772-f24a-4da2-8038-bb0a1c63eb28','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('cdb4a201-71ac-4d40-8ccd-fca139017bd5','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('cdb4a201-71ac-4d40-8ccd-fca139017bd5','8224f627-d251-4878-9212-8bace8f01db6'),
('cdb4a201-71ac-4d40-8ccd-fca139017bd5','226bc708-130a-490c-8232-d5f696f50e9c'),
('cdb4a201-71ac-4d40-8ccd-fca139017bd5','78f6afd2-3d2b-4396-aade-87777de434d3'),
('cdb4a201-71ac-4d40-8ccd-fca139017bd5','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('8fb38991-d066-4d4f-a092-29fd946e1a0e','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('8fb38991-d066-4d4f-a092-29fd946e1a0e','8224f627-d251-4878-9212-8bace8f01db6'),
('8fb38991-d066-4d4f-a092-29fd946e1a0e','226bc708-130a-490c-8232-d5f696f50e9c'),
('8fb38991-d066-4d4f-a092-29fd946e1a0e','b6359355-ef13-469f-8fad-dc11d659a93a'),
('8fb38991-d066-4d4f-a092-29fd946e1a0e','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('a7e57939-95ca-4ba3-83fe-90fca79de9fa','226bc708-130a-490c-8232-d5f696f50e9c'),
('a7e57939-95ca-4ba3-83fe-90fca79de9fa','78f6afd2-3d2b-4396-aade-87777de434d3'),
('a7e57939-95ca-4ba3-83fe-90fca79de9fa','b6359355-ef13-469f-8fad-dc11d659a93a'),
('d34398db-33a3-4170-87b7-fad9564eecfe','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('d34398db-33a3-4170-87b7-fad9564eecfe','8224f627-d251-4878-9212-8bace8f01db6'),
('d34398db-33a3-4170-87b7-fad9564eecfe','b6359355-ef13-469f-8fad-dc11d659a93a'),
('d34398db-33a3-4170-87b7-fad9564eecfe','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('d34398db-33a3-4170-87b7-fad9564eecfe','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('d34398db-33a3-4170-87b7-fad9564eecfe','7ba9ce70-096b-436b-8987-911498799ab4'),
('d34398db-33a3-4170-87b7-fad9564eecfe','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('d34398db-33a3-4170-87b7-fad9564eecfe','b8efdf1b-ea1e-4625-ac8f-811b96b319b3'),
('d34398db-33a3-4170-87b7-fad9564eecfe','7e00741f-427d-4224-844f-c7a5b8c328dd'),
('d34398db-33a3-4170-87b7-fad9564eecfe','1dfe37b8-3297-48bf-ae30-77c289d68ab1'),
('d34398db-33a3-4170-87b7-fad9564eecfe','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('d34398db-33a3-4170-87b7-fad9564eecfe','6e38025e-ac56-4a6a-adb0-5a70ad140630'),
('d34398db-33a3-4170-87b7-fad9564eecfe','d3a98f34-78c9-427e-8150-48664495e151'),
('d34398db-33a3-4170-87b7-fad9564eecfe','1740052c-c9e9-4730-a2b1-e550ca2d6f43'),
('d34398db-33a3-4170-87b7-fad9564eecfe','6e4998dc-94ad-4e36-8e0e-e4e4a08e164c'),
('d34398db-33a3-4170-87b7-fad9564eecfe','d547bc27-fb27-4b87-a839-ff236c10d1e7'),
('d34398db-33a3-4170-87b7-fad9564eecfe','da006819-7974-4154-99c4-518cff7c8588'),
('d34398db-33a3-4170-87b7-fad9564eecfe','4aefedd4-a855-4b77-83e3-1b237d98960f'),
('d34398db-33a3-4170-87b7-fad9564eecfe','b6222b9f-93ce-492d-97c7-cd4165912804'),
('d34398db-33a3-4170-87b7-fad9564eecfe','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('1a4584c6-0b22-4b5e-85f4-130093570825','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('1a4584c6-0b22-4b5e-85f4-130093570825','8224f627-d251-4878-9212-8bace8f01db6'),
('1a4584c6-0b22-4b5e-85f4-130093570825','3259bd25-4a2d-46c5-bdbd-0b227503779e'),
('1a4584c6-0b22-4b5e-85f4-130093570825','62b8f515-b59e-47b9-a056-41cb0eaef77a'),
('1a4584c6-0b22-4b5e-85f4-130093570825','7ba9ce70-096b-436b-8987-911498799ab4'),
('1a4584c6-0b22-4b5e-85f4-130093570825','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('1a4584c6-0b22-4b5e-85f4-130093570825','1f99f68c-e9e9-4ce6-8375-bc2653c009a2'),
('1a4584c6-0b22-4b5e-85f4-130093570825','e6d48da4-e129-4eeb-8d41-4ec4548d71a1'),
('1a4584c6-0b22-4b5e-85f4-130093570825','7e00741f-427d-4224-844f-c7a5b8c328dd'),
('1a4584c6-0b22-4b5e-85f4-130093570825','1dfe37b8-3297-48bf-ae30-77c289d68ab1'),
('1a4584c6-0b22-4b5e-85f4-130093570825','992de5be-1144-48ca-b236-1708b46adfad'),
('1a4584c6-0b22-4b5e-85f4-130093570825','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('1a4584c6-0b22-4b5e-85f4-130093570825','4aefedd4-a855-4b77-83e3-1b237d98960f'),
('1a4584c6-0b22-4b5e-85f4-130093570825','3d3df6ea-d93d-4d52-b932-bd33b2b93133'),
('1a4584c6-0b22-4b5e-85f4-130093570825','b6222b9f-93ce-492d-97c7-cd4165912804'),
('1a4584c6-0b22-4b5e-85f4-130093570825','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','8224f627-d251-4878-9212-8bace8f01db6'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','b6359355-ef13-469f-8fad-dc11d659a93a'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','0b092c6e-e7b8-4daf-abe0-bfdcb11d0326'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','9fa42c00-b56c-4097-9a0c-10fcb646daaa'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','0a1c6e47-78c3-44c4-9f5a-285b19ba829c'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','41a0f45d-11a4-4efc-acf5-d27817c46c3c'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','f9d240e8-9251-42e6-acb8-895ba0815fc6'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','1f99f68c-e9e9-4ce6-8375-bc2653c009a2'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','240f4f16-3543-4b34-8857-e7d44cd4d1a0'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','1dfe37b8-3297-48bf-ae30-77c289d68ab1'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','909fd31b-dbce-4556-bf6f-4142109e02e4'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','c88e6123-9c63-4f2b-b7ed-41f31046e52a'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','1740052c-c9e9-4730-a2b1-e550ca2d6f43'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','d547bc27-fb27-4b87-a839-ff236c10d1e7'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','da006819-7974-4154-99c4-518cff7c8588'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','797ece9e-1bb0-42d9-b8b7-623953119902'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','4aefedd4-a855-4b77-83e3-1b237d98960f'),
('d3a6ed39-4cc5-40ae-8fae-a08662c76e5f','eeb8cec7-c167-4e2d-b092-638ecdb637ce'),
('98862972-4eb3-4c16-927a-ff4df177036e','8224f627-d251-4878-9212-8bace8f01db6'),
('98862972-4eb3-4c16-927a-ff4df177036e','226bc708-130a-490c-8232-d5f696f50e9c'),
('98862972-4eb3-4c16-927a-ff4df177036e','3259bd25-4a2d-46c5-bdbd-0b227503779e'),
('9bc3f113-a5bd-4b3d-8457-90c335705ef5','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('8ce151db-219d-4af3-a2f7-5c030dd5a866','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('8ce151db-219d-4af3-a2f7-5c030dd5a866','8224f627-d251-4878-9212-8bace8f01db6'),
('8ce151db-219d-4af3-a2f7-5c030dd5a866','b6359355-ef13-469f-8fad-dc11d659a93a'),
('8ce151db-219d-4af3-a2f7-5c030dd5a866','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('533fb89c-d4af-416c-b029-7ff2f4a7e981','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3','7ba9ce70-096b-436b-8987-911498799ab4'),
('0fbf8aa5-8f23-4ed4-8f1f-49c985f3abe3','9fa42c00-b56c-4097-9a0c-10fcb646daaa'),
('9537b69f-33bd-4980-9163-67109ba591ab','b6359355-ef13-469f-8fad-dc11d659a93a'),
('9537b69f-33bd-4980-9163-67109ba591ab','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('9537b69f-33bd-4980-9163-67109ba591ab','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('9537b69f-33bd-4980-9163-67109ba591ab','b6222b9f-93ce-492d-97c7-cd4165912804'),
('9537b69f-33bd-4980-9163-67109ba591ab','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','226bc708-130a-490c-8232-d5f696f50e9c'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','b6359355-ef13-469f-8fad-dc11d659a93a'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','7e00741f-427d-4224-844f-c7a5b8c328dd'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('488a9f08-fa60-4f60-9c7b-8c8521afeb5e','dba6a6b7-02f3-41fa-b3e0-3671042134f7'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','8224f627-d251-4878-9212-8bace8f01db6'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','b6359355-ef13-469f-8fad-dc11d659a93a'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','3259bd25-4a2d-46c5-bdbd-0b227503779e'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','a4493300-70f3-4872-a4c6-83bd6035a700'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','9fa42c00-b56c-4097-9a0c-10fcb646daaa'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','d3a98f34-78c9-427e-8150-48664495e151'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','6e4998dc-94ad-4e36-8e0e-e4e4a08e164c'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','b6222b9f-93ce-492d-97c7-cd4165912804'),
('8915adca-a23c-4e33-aabb-c1aa77e461d3','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('49e80d54-467d-48d0-a767-95aebe17d137','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('49e80d54-467d-48d0-a767-95aebe17d137','8224f627-d251-4878-9212-8bace8f01db6'),
('49e80d54-467d-48d0-a767-95aebe17d137','78f6afd2-3d2b-4396-aade-87777de434d3'),
('49e80d54-467d-48d0-a767-95aebe17d137','b6359355-ef13-469f-8fad-dc11d659a93a'),
('49e80d54-467d-48d0-a767-95aebe17d137','3d3df6ea-d93d-4d52-b932-bd33b2b93133'),
('49e80d54-467d-48d0-a767-95aebe17d137','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('49e80d54-467d-48d0-a767-95aebe17d137','dba6a6b7-02f3-41fa-b3e0-3671042134f7'),
('49e80d54-467d-48d0-a767-95aebe17d137','d8bc176b-79dd-4d15-938d-48474984d023'),
('98751ac0-98bc-443f-be05-17f03c42101a','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('98751ac0-98bc-443f-be05-17f03c42101a','8224f627-d251-4878-9212-8bace8f01db6'),
('98751ac0-98bc-443f-be05-17f03c42101a','b6359355-ef13-469f-8fad-dc11d659a93a'),
('98751ac0-98bc-443f-be05-17f03c42101a','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('98751ac0-98bc-443f-be05-17f03c42101a','7ba9ce70-096b-436b-8987-911498799ab4'),
('98751ac0-98bc-443f-be05-17f03c42101a','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('98751ac0-98bc-443f-be05-17f03c42101a','0b092c6e-e7b8-4daf-abe0-bfdcb11d0326'),
('98751ac0-98bc-443f-be05-17f03c42101a','41a0f45d-11a4-4efc-acf5-d27817c46c3c'),
('98751ac0-98bc-443f-be05-17f03c42101a','7e00741f-427d-4224-844f-c7a5b8c328dd'),
('98751ac0-98bc-443f-be05-17f03c42101a','44cc8891-ef34-41e0-a2e5-620ca53594cf'),
('98751ac0-98bc-443f-be05-17f03c42101a','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('98751ac0-98bc-443f-be05-17f03c42101a','d3a98f34-78c9-427e-8150-48664495e151'),
('98751ac0-98bc-443f-be05-17f03c42101a','1740052c-c9e9-4730-a2b1-e550ca2d6f43'),
('98751ac0-98bc-443f-be05-17f03c42101a','6e4998dc-94ad-4e36-8e0e-e4e4a08e164c'),
('98751ac0-98bc-443f-be05-17f03c42101a','d547bc27-fb27-4b87-a839-ff236c10d1e7'),
('98751ac0-98bc-443f-be05-17f03c42101a','da006819-7974-4154-99c4-518cff7c8588'),
('98751ac0-98bc-443f-be05-17f03c42101a','797ece9e-1bb0-42d9-b8b7-623953119902'),
('98751ac0-98bc-443f-be05-17f03c42101a','eeb8cec7-c167-4e2d-b092-638ecdb637ce'),
('98751ac0-98bc-443f-be05-17f03c42101a','b6222b9f-93ce-492d-97c7-cd4165912804'),
('98751ac0-98bc-443f-be05-17f03c42101a','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','78f6afd2-3d2b-4396-aade-87777de434d3'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','b6359355-ef13-469f-8fad-dc11d659a93a'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','3259bd25-4a2d-46c5-bdbd-0b227503779e'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','ec31694f-6ae8-4006-a5c9-64ba4e789fa2'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','7e00741f-427d-4224-844f-c7a5b8c328dd'),
('5e7ace0e-f621-4c1b-b7c9-fe51be3291e3','53ac078f-dac9-4a93-99cc-1dcc751a98d2'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','226bc708-130a-490c-8232-d5f696f50e9c'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','78f6afd2-3d2b-4396-aade-87777de434d3'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','3259bd25-4a2d-46c5-bdbd-0b227503779e'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','da006819-7974-4154-99c4-518cff7c8588'),
('f02a317e-026c-4d13-bfbf-fa5c608d2352','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','7ba9ce70-096b-436b-8987-911498799ab4'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','0b092c6e-e7b8-4daf-abe0-bfdcb11d0326'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','0e147599-c83f-4c10-a0d2-4b8277aa1520'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','c89af083-9dbe-4df0-a84e-1c488ece329d'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','dba6a6b7-02f3-41fa-b3e0-3671042134f7'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','b6222b9f-93ce-492d-97c7-cd4165912804'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('7d3784cc-1512-4685-94fa-ae44878b0f83','d8bc176b-79dd-4d15-938d-48474984d023'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','8224f627-d251-4878-9212-8bace8f01db6'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','78f6afd2-3d2b-4396-aade-87777de434d3'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','b6359355-ef13-469f-8fad-dc11d659a93a'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','d7280cf7-95f0-4ef8-a79e-d6da36eb7953'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','9fa42c00-b56c-4097-9a0c-10fcb646daaa'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','98da3cb5-4f7f-4fdb-9dae-45a96a74c098'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','6e38025e-ac56-4a6a-adb0-5a70ad140630'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','797ece9e-1bb0-42d9-b8b7-623953119902'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','3d3df6ea-d93d-4d52-b932-bd33b2b93133'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','b6222b9f-93ce-492d-97c7-cd4165912804'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','caeafe4f-fce0-4a4e-97e6-3ad857dcaa95'),
('8ea87eea-913e-4d93-b2d5-393a323ed9f6','d8bc176b-79dd-4d15-938d-48474984d023'),
('52436803-42cf-419a-a380-f1578fc3c1a9','dfc63043-c855-4cdf-8a2f-5cded613766d'),
('52436803-42cf-419a-a380-f1578fc3c1a9','319a39cd-7b3b-4a0a-bb0d-bf9bfaff0f78'),
('52436803-42cf-419a-a380-f1578fc3c1a9','226bc708-130a-490c-8232-d5f696f50e9c'),
('52436803-42cf-419a-a380-f1578fc3c1a9','78f6afd2-3d2b-4396-aade-87777de434d3'),
('52436803-42cf-419a-a380-f1578fc3c1a9','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('52436803-42cf-419a-a380-f1578fc3c1a9','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('52436803-42cf-419a-a380-f1578fc3c1a9','b8efdf1b-ea1e-4625-ac8f-811b96b319b3'),
('52436803-42cf-419a-a380-f1578fc3c1a9','da006819-7974-4154-99c4-518cff7c8588'),
('52436803-42cf-419a-a380-f1578fc3c1a9','eeb8cec7-c167-4e2d-b092-638ecdb637ce'),
('52436803-42cf-419a-a380-f1578fc3c1a9','3d3df6ea-d93d-4d52-b932-bd33b2b93133'),
('52436803-42cf-419a-a380-f1578fc3c1a9','a6ca22cc-171c-4e82-9da4-0f76973f3d50'),
('52436803-42cf-419a-a380-f1578fc3c1a9','dba6a6b7-02f3-41fa-b3e0-3671042134f7'),
('52436803-42cf-419a-a380-f1578fc3c1a9','b6222b9f-93ce-492d-97c7-cd4165912804'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','1f270045-2a76-4062-ad4f-a23c84a7afa1'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','7ba9ce70-096b-436b-8987-911498799ab4'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','6a287851-857e-4ec8-816a-dd9be9fe3116'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','0a1c6e47-78c3-44c4-9f5a-285b19ba829c'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','1f99f68c-e9e9-4ce6-8375-bc2653c009a2'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','240f4f16-3543-4b34-8857-e7d44cd4d1a0'),
('e82ae06d-9a99-43a1-961a-b560ec726b06','6e38025e-ac56-4a6a-adb0-5a70ad140630');

-- wallets
INSERT INTO "wallets" (id, solde, is_active, user_id, created_at, updated_at) VALUES
('55555555-5555-5555-5555-555555555555',15000,true,'33333333-3333-3333-3333-333333333333','2026-04-11 20:09:38.851313','2026-04-11 20:09:38.851313');

-- ---------------------------------------------------------------------------
-- 4. TABLE migrations (tracking TypeORM — évite que migration:run rejoue tout)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "migrations" (
  "id"        SERIAL  NOT NULL,
  "timestamp" bigint  NOT NULL,
  "name"      varchar NOT NULL,
  CONSTRAINT "PK_migrations" PRIMARY KEY ("id")
);
INSERT INTO "migrations" ("timestamp","name") VALUES (1750464000000,'InitialSchema1750464000000');
