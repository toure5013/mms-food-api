-- =============================================================================
-- MMS CANTINE — Schéma initial complet
-- À exécuter UNE SEULE FOIS sur une base PostgreSQL vide
-- Compatible pgAdmin : copier-coller dans l'éditeur de requêtes et exécuter
-- =============================================================================

-- ---------------------------------------------------------------------------
-- 1. TYPES ENUM
-- ---------------------------------------------------------------------------

CREATE TYPE "users_role_enum" AS ENUM (
  'SUPER_ADMIN',
  'ADMIN_MMS',
  'ADMIN_CLIENT',
  'EMPLOYEE',
  'COOK',
  'PATIENT',
  'SERVER'
);

CREATE TYPE "organisations_mode_gestion_menu_enum" AS ENUM (
  'AUTONOME',
  'MMS'
);

CREATE TYPE "organisations_subvention_type_enum" AS ENUM (
  'FIXED',
  'PERCENTAGE',
  'CAPPED',
  'HYBRID',
  'FULL'
);

CREATE TYPE "organisations_financial_mode_enum" AS ENUM (
  'DEBT',
  'WALLET'
);

CREATE TYPE "dishes_categorie_enum" AS ENUM (
  'ENTREE',
  'RESISTANCE',
  'DESSERT',
  'CAFE',
  'BOISSON',
  'COLLATION'
);

CREATE TYPE "menus_creneau_enum" AS ENUM (
  'MORNING',
  'NOON',
  'EVENING',
  'SNACK'
);

CREATE TYPE "orders_statut_enum" AS ENUM (
  'PENDING',
  'CONFIRMED',
  'PAID',
  'PREPARING',
  'READY',
  'RETRIEVED',
  'CANCELLED'
);

CREATE TYPE "orders_creneau_enum" AS ENUM (
  'MORNING',
  'NOON',
  'EVENING',
  'SNACK'
);

CREATE TYPE "orders_methode_paiement_enum" AS ENUM (
  'WAVE',
  'ORANGE_MONEY',
  'MTN',
  'CINETPAY',
  'PAYDUNYA',
  'WALLET',
  'EMPLOYER'
);

CREATE TYPE "payments_methode_enum" AS ENUM (
  'WAVE',
  'ORANGE_MONEY',
  'MTN',
  'CINETPAY',
  'PAYDUNYA',
  'WALLET',
  'EMPLOYER'
);

CREATE TYPE "payments_statut_enum" AS ENUM (
  'PENDING',
  'SUCCESS',
  'FAILED',
  'REFUNDED'
);

CREATE TYPE "notifications_canal_enum" AS ENUM (
  'PUSH',
  'EMAIL',
  'SMS'
);

CREATE TYPE "wallet_transactions_type_enum" AS ENUM (
  'CREDIT',
  'DEBIT'
);

CREATE TYPE "loyalty_transactions_type_enum" AS ENUM (
  'EARNED',
  'REDEEMED',
  'EXPIRED',
  'BONUS'
);

-- ---------------------------------------------------------------------------
-- 2. TABLE settings
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

-- ---------------------------------------------------------------------------
-- 3. TABLE organisations
-- ---------------------------------------------------------------------------

CREATE TABLE "organisations" (
  "id"                         uuid          NOT NULL DEFAULT gen_random_uuid(),
  "slug"                       varchar       NOT NULL,
  "nom"                        varchar       NOT NULL,
  "logo_url"                   varchar,
  "couleur_primaire"           varchar       NOT NULL DEFAULT '#E87722',
  "couleur_secondaire"         varchar       NOT NULL DEFAULT '#1A1A2E',
  "mode_gestion_menu"          "organisations_mode_gestion_menu_enum"  NOT NULL DEFAULT 'MMS',
  "subvention_type"            "organisations_subvention_type_enum"    NOT NULL DEFAULT 'FIXED',
  "financial_mode"             "organisations_financial_mode_enum"     NOT NULL DEFAULT 'DEBT',
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

-- ---------------------------------------------------------------------------
-- 4. TABLE users
-- ---------------------------------------------------------------------------

CREATE TABLE "users" (
  "id"                uuid              NOT NULL DEFAULT gen_random_uuid(),
  "prenom"            varchar           NOT NULL,
  "nom"               varchar           NOT NULL,
  "email"             varchar           NOT NULL,
  "password_hash"     varchar,
  "role"              "users_role_enum" NOT NULL,
  "telephone"         varchar,
  "avatar_url"        varchar,
  "service"           varchar,
  "regimes"           text,
  "allergies"         text,
  "otp_code"          varchar,
  "otp_expires_at"    TIMESTAMP,
  "loyalty_points"    integer           NOT NULL DEFAULT 0,
  "loyalty_expires_at" TIMESTAMP,
  "fcm_token"         varchar,
  "is_active"         boolean           NOT NULL DEFAULT true,
  "is_first_login"    boolean           NOT NULL DEFAULT false,
  "organisation_id"   uuid,
  "created_at"        TIMESTAMP         NOT NULL DEFAULT now(),
  "updated_at"        TIMESTAMP         NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_users_email"        UNIQUE ("email"),
  CONSTRAINT "PK_users"              PRIMARY KEY ("id"),
  CONSTRAINT "FK_users_organisation" FOREIGN KEY ("organisation_id")
    REFERENCES "organisations" ("id") ON DELETE SET NULL
);

-- ---------------------------------------------------------------------------
-- 5. TABLE dishes
-- ---------------------------------------------------------------------------

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
    REFERENCES "organisations" ("id") ON DELETE CASCADE
);

CREATE INDEX "IDX_dishes_organisation_id" ON "dishes" ("organisation_id");

-- ---------------------------------------------------------------------------
-- 6. TABLE menus
-- ---------------------------------------------------------------------------

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
    REFERENCES "organisations" ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 7. TABLE menu_dishes  (table de jonction Menu <-> Dish)
-- ---------------------------------------------------------------------------

CREATE TABLE "menu_dishes" (
  "menus_id"  uuid NOT NULL,
  "dishes_id" uuid NOT NULL,
  CONSTRAINT "PK_menu_dishes"       PRIMARY KEY ("menus_id", "dishes_id"),
  CONSTRAINT "FK_menu_dishes_menu"  FOREIGN KEY ("menus_id")
    REFERENCES "menus"  ("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_menu_dishes_dish"  FOREIGN KEY ("dishes_id")
    REFERENCES "dishes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "IDX_menu_dishes_menus_id"  ON "menu_dishes" ("menus_id");
CREATE INDEX "IDX_menu_dishes_dishes_id" ON "menu_dishes" ("dishes_id");

-- ---------------------------------------------------------------------------
-- 8. TABLE orders
-- ---------------------------------------------------------------------------

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
    REFERENCES "users"         ("id") ON DELETE SET NULL,
  CONSTRAINT "FK_orders_organisation"    FOREIGN KEY ("organisation_id")
    REFERENCES "organisations" ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 9. TABLE order_dishes  (table de jonction Order <-> Dish)
-- ---------------------------------------------------------------------------

CREATE TABLE "order_dishes" (
  "orders_id" uuid NOT NULL,
  "dishes_id" uuid NOT NULL,
  CONSTRAINT "PK_order_dishes"        PRIMARY KEY ("orders_id", "dishes_id"),
  CONSTRAINT "FK_order_dishes_order"  FOREIGN KEY ("orders_id")
    REFERENCES "orders" ("id")  ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "FK_order_dishes_dish"   FOREIGN KEY ("dishes_id")
    REFERENCES "dishes" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "IDX_order_dishes_orders_id" ON "order_dishes" ("orders_id");
CREATE INDEX "IDX_order_dishes_dishes_id" ON "order_dishes" ("dishes_id");

-- ---------------------------------------------------------------------------
-- 10. TABLE payments
-- ---------------------------------------------------------------------------

CREATE TABLE "payments" (
  "id"                      uuid                   NOT NULL DEFAULT gen_random_uuid(),
  "reference"               varchar                NOT NULL,
  "methode"                 "payments_methode_enum" NOT NULL,
  "statut"                  "payments_statut_enum"  NOT NULL DEFAULT 'PENDING',
  "montant"                 numeric(10,2)          NOT NULL,
  "telephone"               varchar,
  "provider_transaction_id" varchar,
  "provider_response"       varchar,
  "error_message"           varchar,
  "order_id"                uuid                   NOT NULL,
  "user_id"                 uuid                   NOT NULL,
  "created_at"              TIMESTAMP              NOT NULL DEFAULT now(),
  "updated_at"              TIMESTAMP              NOT NULL DEFAULT now(),
  CONSTRAINT "UQ_payments_reference" UNIQUE ("reference"),
  CONSTRAINT "PK_payments"           PRIMARY KEY ("id"),
  CONSTRAINT "FK_payments_order"     FOREIGN KEY ("order_id")
    REFERENCES "orders" ("id") ON DELETE CASCADE,
  CONSTRAINT "FK_payments_user"      FOREIGN KEY ("user_id")
    REFERENCES "users"  ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 11. TABLE wallets
-- ---------------------------------------------------------------------------

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
    REFERENCES "users" ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 12. TABLE wallet_transactions
-- ---------------------------------------------------------------------------

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
    REFERENCES "wallets" ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 13. TABLE notifications
-- ---------------------------------------------------------------------------

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
    REFERENCES "users" ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 14. TABLE loyalty_transactions
-- ---------------------------------------------------------------------------

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
    REFERENCES "users" ("id") ON DELETE CASCADE
);

-- ---------------------------------------------------------------------------
-- 15. TABLE migrations  (tracking TypeORM — empêche migration:run de tout rejouer)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS "migrations" (
  "id"        SERIAL  NOT NULL,
  "timestamp" bigint  NOT NULL,
  "name"      varchar NOT NULL,
  CONSTRAINT "PK_migrations" PRIMARY KEY ("id")
);

INSERT INTO "migrations" ("timestamp", "name")
VALUES (1750464000000, 'InitialSchema1750464000000');
