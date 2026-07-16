-- =============================================================================
-- PATCH : renommer les colonnes des tables de jonction (snake_case → camelCase)
-- À exécuter UNE SEULE FOIS sur la base production via pgAdmin
-- TypeORM génère les requêtes avec "ordersId"/"dishesId"/"menusId" (camelCase)
-- =============================================================================

BEGIN;

-- ---- order_dishes -----------------------------------------------------------

-- Supprimer les anciens index (s'ils existent)
DROP INDEX IF EXISTS "IDX_order_dishes_orders_id";
DROP INDEX IF EXISTS "IDX_order_dishes_dishes_id";

-- Renommer les colonnes
-- PostgreSQL met à jour automatiquement les FK et PK qui référencent ces colonnes
ALTER TABLE "order_dishes" RENAME COLUMN "orders_id" TO "ordersId";
ALTER TABLE "order_dishes" RENAME COLUMN "dishes_id" TO "dishesId";

-- Recréer les index avec les nouveaux noms
CREATE INDEX IF NOT EXISTS "IDX_order_dishes_ordersId" ON "order_dishes" ("ordersId");
CREATE INDEX IF NOT EXISTS "IDX_order_dishes_dishesId" ON "order_dishes" ("dishesId");

-- ---- menu_dishes ------------------------------------------------------------

DROP INDEX IF EXISTS "IDX_menu_dishes_menus_id";
DROP INDEX IF EXISTS "IDX_menu_dishes_dishes_id";

ALTER TABLE "menu_dishes" RENAME COLUMN "menus_id" TO "menusId";
ALTER TABLE "menu_dishes" RENAME COLUMN "dishes_id" TO "dishesId";

CREATE INDEX IF NOT EXISTS "IDX_menu_dishes_menusId"  ON "menu_dishes" ("menusId");
CREATE INDEX IF NOT EXISTS "IDX_menu_dishes_dishesId" ON "menu_dishes" ("dishesId");

COMMIT;

-- Vérification : ces requêtes doivent retourner les colonnes avec les nouveaux noms
SELECT column_name FROM information_schema.columns WHERE table_name = 'order_dishes' ORDER BY ordinal_position;
SELECT column_name FROM information_schema.columns WHERE table_name = 'menu_dishes'  ORDER BY ordinal_position;
