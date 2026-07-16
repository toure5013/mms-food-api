import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1750464000000 implements MigrationInterface {
  name = 'InitialSchema1750464000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Enum types ───────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TYPE "users_role_enum" AS ENUM(
        'SUPER_ADMIN','ADMIN_MMS','ADMIN_CLIENT','EMPLOYEE','COOK','PATIENT','SERVER'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "organisations_mode_gestion_menu_enum" AS ENUM('AUTONOME','MMS')
    `);
    await queryRunner.query(`
      CREATE TYPE "organisations_subvention_type_enum" AS ENUM(
        'FIXED','PERCENTAGE','CAPPED','HYBRID','FULL'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "organisations_financial_mode_enum" AS ENUM('DEBT','WALLET')
    `);
    await queryRunner.query(`
      CREATE TYPE "dishes_categorie_enum" AS ENUM(
        'ENTREE','RESISTANCE','DESSERT','CAFE','BOISSON','COLLATION'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "menus_creneau_enum" AS ENUM('MORNING','NOON','EVENING','SNACK')
    `);
    await queryRunner.query(`
      CREATE TYPE "orders_statut_enum" AS ENUM(
        'PENDING','CONFIRMED','PAID','PREPARING','READY','RETRIEVED','CANCELLED'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "orders_creneau_enum" AS ENUM('MORNING','NOON','EVENING','SNACK')
    `);
    await queryRunner.query(`
      CREATE TYPE "orders_methode_paiement_enum" AS ENUM(
        'WAVE','ORANGE_MONEY','MTN','CINETPAY','PAYDUNYA','WALLET','EMPLOYER'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "payments_methode_enum" AS ENUM(
        'WAVE','ORANGE_MONEY','MTN','CINETPAY','PAYDUNYA','WALLET','EMPLOYER'
      )
    `);
    await queryRunner.query(`
      CREATE TYPE "payments_statut_enum" AS ENUM('PENDING','SUCCESS','FAILED','REFUNDED')
    `);
    await queryRunner.query(`
      CREATE TYPE "notifications_canal_enum" AS ENUM('PUSH','EMAIL','SMS')
    `);
    await queryRunner.query(`
      CREATE TYPE "wallet_transactions_type_enum" AS ENUM('CREDIT','DEBIT')
    `);
    await queryRunner.query(`
      CREATE TYPE "loyalty_transactions_type_enum" AS ENUM(
        'EARNED','REDEEMED','EXPIRED','BONUS'
      )
    `);

    // ─── settings ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "settings" (
        "id"          SERIAL      NOT NULL,
        "general"     jsonb,
        "branding"    jsonb,
        "notifs"      jsonb,
        "security"    jsonb,
        "org"         jsonb,
        "dietary"     jsonb,
        "features"    jsonb,
        "created_at"  TIMESTAMP   NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_settings" PRIMARY KEY ("id")
      )
    `);

    // ─── organisations ────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "organisations" (
        "id"                         uuid        NOT NULL DEFAULT gen_random_uuid(),
        "slug"                       varchar     NOT NULL,
        "nom"                        varchar     NOT NULL,
        "logo_url"                   varchar,
        "couleur_primaire"           varchar     NOT NULL DEFAULT '#E87722',
        "couleur_secondaire"         varchar     NOT NULL DEFAULT '#1A1A2E',
        "mode_gestion_menu"          "organisations_mode_gestion_menu_enum"    NOT NULL DEFAULT 'MMS',
        "subvention_type"            "organisations_subvention_type_enum"      NOT NULL DEFAULT 'FIXED',
        "financial_mode"             "organisations_financial_mode_enum"       NOT NULL DEFAULT 'DEBT',
        "subvention_valeur"          numeric(10,2) NOT NULL DEFAULT '0',
        "subvention_plafond_mensuel" numeric(10,2),
        "is_active"                  boolean     NOT NULL DEFAULT true,
        "prix_min_plats"             numeric(10,2) NOT NULL DEFAULT '0',
        "prix_max_plats"             numeric(10,2) NOT NULL DEFAULT '0',
        "prix_max_menu"              numeric(10,2) NOT NULL DEFAULT '0',
        "is_guest_order_enabled"     boolean     NOT NULL DEFAULT false,
        "guest_config"               jsonb,
        "guest_order_start_time"     varchar,
        "guest_order_end_time"       varchar,
        "order_day_offset"           integer     NOT NULL DEFAULT '0',
        "created_at"                 TIMESTAMP   NOT NULL DEFAULT now(),
        "updated_at"                 TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_organisations_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_organisations"      PRIMARY KEY ("id")
      )
    `);

    // ─── users ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"               uuid                  NOT NULL DEFAULT gen_random_uuid(),
        "prenom"           varchar               NOT NULL,
        "nom"              varchar               NOT NULL,
        "email"            varchar               NOT NULL,
        "password_hash"    varchar,
        "role"             "users_role_enum"     NOT NULL,
        "telephone"        varchar,
        "avatar_url"       varchar,
        "service"          varchar,
        "regimes"          text,
        "allergies"        text,
        "otp_code"         varchar,
        "otp_expires_at"   TIMESTAMP,
        "loyalty_points"   integer               NOT NULL DEFAULT '0',
        "loyalty_expires_at" TIMESTAMP,
        "fcm_token"        varchar,
        "is_active"        boolean               NOT NULL DEFAULT true,
        "is_first_login"   boolean               NOT NULL DEFAULT false,
        "organisation_id"  uuid,
        "created_at"       TIMESTAMP             NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMP             NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email"        UNIQUE ("email"),
        CONSTRAINT "PK_users"              PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_organisation" FOREIGN KEY ("organisation_id")
          REFERENCES "organisations"("id") ON DELETE SET NULL
      )
    `);

    // ─── dishes ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "dishes" (
        "id"              uuid                    NOT NULL DEFAULT gen_random_uuid(),
        "nom"             varchar                 NOT NULL,
        "description"     varchar,
        "photo_url"       varchar,
        "categorie"       "dishes_categorie_enum",
        "prix"            numeric(10,2)           NOT NULL,
        "sans_sel"        boolean                 NOT NULL DEFAULT false,
        "sans_gras"       boolean                 NOT NULL DEFAULT false,
        "sans_sucre"      boolean                 NOT NULL DEFAULT false,
        "sans_huile"      boolean                 NOT NULL DEFAULT false,
        "vegetarien"      boolean                 NOT NULL DEFAULT false,
        "halal"           boolean                 NOT NULL DEFAULT false,
        "allergenes"      text,
        "organisation_id" uuid,
        "is_active"       boolean                 NOT NULL DEFAULT true,
        "created_at"      TIMESTAMP               NOT NULL DEFAULT now(),
        "updated_at"      TIMESTAMP               NOT NULL DEFAULT now(),
        CONSTRAINT "PK_dishes"              PRIMARY KEY ("id"),
        CONSTRAINT "FK_dishes_organisation" FOREIGN KEY ("organisation_id")
          REFERENCES "organisations"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_dishes_organisation_id" ON "dishes" ("organisation_id")`);

    // ─── menus ────────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "menus" (
        "id"                uuid                  NOT NULL DEFAULT gen_random_uuid(),
        "date"              date                  NOT NULL,
        "creneau"           "menus_creneau_enum"  NOT NULL,
        "is_published"      boolean               NOT NULL DEFAULT false,
        "photo_url"         varchar,
        "published_at"      TIMESTAMP,
        "publication_limite" TIMESTAMP,
        "organisation_id"   uuid                  NOT NULL,
        "created_at"        TIMESTAMP             NOT NULL DEFAULT now(),
        "updated_at"        TIMESTAMP             NOT NULL DEFAULT now(),
        CONSTRAINT "PK_menus"              PRIMARY KEY ("id"),
        CONSTRAINT "FK_menus_organisation" FOREIGN KEY ("organisation_id")
          REFERENCES "organisations"("id") ON DELETE CASCADE
      )
    `);

    // ─── menu_dishes (junction) ───────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "menu_dishes" (
        "menusId"  uuid NOT NULL,
        "dishesId" uuid NOT NULL,
        CONSTRAINT "PK_menu_dishes" PRIMARY KEY ("menusId", "dishesId"),
        CONSTRAINT "FK_menu_dishes_menu"  FOREIGN KEY ("menusId")
          REFERENCES "menus"("id")  ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_menu_dishes_dish"  FOREIGN KEY ("dishesId")
          REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_menu_dishes_menusId"  ON "menu_dishes" ("menusId")`);
    await queryRunner.query(`CREATE INDEX "IDX_menu_dishes_dishesId" ON "menu_dishes" ("dishesId")`);

    // ─── orders ───────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id"                 uuid                            NOT NULL DEFAULT gen_random_uuid(),
        "numero_commande"    varchar                         NOT NULL,
        "qr_code_token"      varchar                         NOT NULL,
        "statut"             "orders_statut_enum"            NOT NULL DEFAULT 'PENDING',
        "creneau"            "orders_creneau_enum"           NOT NULL,
        "date_livraison"     date                            NOT NULL,
        "montant_total"      numeric(10,2)                   NOT NULL,
        "montant_subvention" numeric(10,2)                   NOT NULL DEFAULT '0',
        "montant_employe"    numeric(10,2)                   NOT NULL DEFAULT '0',
        "methode_paiement"   "orders_methode_paiement_enum",
        "points_gagnes"      integer                         NOT NULL DEFAULT '0',
        "date_recuperation"  TIMESTAMP,
        "recupere_par"       varchar,
        "is_guest"           boolean                         NOT NULL DEFAULT false,
        "guest_info"         jsonb,
        "employe_id"         uuid,
        "organisation_id"    uuid                            NOT NULL,
        "created_at"         TIMESTAMP                       NOT NULL DEFAULT now(),
        "updated_at"         TIMESTAMP                       NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_orders_numero_commande" UNIQUE ("numero_commande"),
        CONSTRAINT "UQ_orders_qr_code_token"   UNIQUE ("qr_code_token"),
        CONSTRAINT "PK_orders"                 PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_employe"         FOREIGN KEY ("employe_id")
          REFERENCES "users"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_orders_organisation"    FOREIGN KEY ("organisation_id")
          REFERENCES "organisations"("id") ON DELETE CASCADE
      )
    `);

    // ─── order_dishes (junction) ──────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "order_dishes" (
        "ordersId" uuid NOT NULL,
        "dishesId" uuid NOT NULL,
        CONSTRAINT "PK_order_dishes" PRIMARY KEY ("ordersId", "dishesId"),
        CONSTRAINT "FK_order_dishes_order" FOREIGN KEY ("ordersId")
          REFERENCES "orders"("id")  ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_order_dishes_dish"  FOREIGN KEY ("dishesId")
          REFERENCES "dishes"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_order_dishes_ordersId" ON "order_dishes" ("ordersId")`);
    await queryRunner.query(`CREATE INDEX "IDX_order_dishes_dishesId" ON "order_dishes" ("dishesId")`);

    // ─── payments ─────────────────────────────────────────────────────────────
    await queryRunner.query(`
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
      )
    `);

    // ─── wallets ──────────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "wallets" (
        "id"         uuid          NOT NULL DEFAULT gen_random_uuid(),
        "solde"      numeric(10,2) NOT NULL DEFAULT '0',
        "is_active"  boolean       NOT NULL DEFAULT true,
        "user_id"    uuid          NOT NULL,
        "created_at" TIMESTAMP     NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_wallets_user_id"  UNIQUE ("user_id"),
        CONSTRAINT "PK_wallets"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_wallets_user"     FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // ─── wallet_transactions ──────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "wallet_transactions" (
        "id"          uuid                              NOT NULL DEFAULT gen_random_uuid(),
        "type"        "wallet_transactions_type_enum"   NOT NULL,
        "montant"     numeric(10,2)                     NOT NULL,
        "solde_apres" numeric(10,2)                     NOT NULL,
        "description" varchar,
        "reference"   varchar,
        "wallet_id"   uuid                              NOT NULL,
        "created_at"  TIMESTAMP                         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_wallet_transactions"       PRIMARY KEY ("id"),
        CONSTRAINT "FK_wallet_transactions_wallet" FOREIGN KEY ("wallet_id")
          REFERENCES "wallets"("id") ON DELETE CASCADE
      )
    `);

    // ─── notifications ────────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"         uuid                      NOT NULL DEFAULT gen_random_uuid(),
        "titre"      varchar                   NOT NULL,
        "message"    text                      NOT NULL,
        "canal"      "notifications_canal_enum" NOT NULL DEFAULT 'PUSH',
        "is_read"    boolean                   NOT NULL DEFAULT false,
        "read_at"    TIMESTAMP,
        "action_url" varchar,
        "metadata"   varchar,
        "user_id"    uuid                      NOT NULL,
        "created_at" TIMESTAMP                 NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications"      PRIMARY KEY ("id"),
        CONSTRAINT "FK_notifications_user" FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    // ─── loyalty_transactions ─────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE "loyalty_transactions" (
        "id"          uuid                              NOT NULL DEFAULT gen_random_uuid(),
        "type"        "loyalty_transactions_type_enum"  NOT NULL,
        "points"      integer                           NOT NULL,
        "description" varchar,
        "reference"   varchar,
        "user_id"     uuid                              NOT NULL,
        "created_at"  TIMESTAMP                         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_loyalty_transactions"       PRIMARY KEY ("id"),
        CONSTRAINT "FK_loyalty_transactions_user"  FOREIGN KEY ("user_id")
          REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "loyalty_transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "notifications"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wallet_transactions"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "wallets"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payments"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "order_dishes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "menu_dishes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "menus"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_dishes_organisation_id"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "dishes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "users"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "organisations"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "settings"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "loyalty_transactions_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "wallet_transactions_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "notifications_canal_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payments_statut_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "payments_methode_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_methode_paiement_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_creneau_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "orders_statut_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "menus_creneau_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "dishes_categorie_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "organisations_financial_mode_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "organisations_subvention_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "organisations_mode_gestion_menu_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "users_role_enum"`);
  }
}
