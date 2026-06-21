import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddServerRoleAndDishOrganisation1750464000000 implements MigrationInterface {
  name = 'AddServerRoleAndDishOrganisation1750464000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Ajouter la valeur SERVER à l'enum user_role
    // PostgreSQL ne permet pas d'ajouter conditionnellement via IF NOT EXISTS avant PG 12
    // On vérifie d'abord si la valeur existe déjà
    const enumCheck = await queryRunner.query(`
      SELECT 1 FROM pg_enum
      JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
      WHERE pg_type.typname LIKE '%role%'
        AND pg_enum.enumlabel = 'SERVER'
    `);

    if (enumCheck.length === 0) {
      await queryRunner.query(`ALTER TYPE "users_role_enum" ADD VALUE 'SERVER'`);
    }

    // 2. Ajouter la colonne organisation_id sur la table dishes
    const colCheck = await queryRunner.query(`
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'dishes' AND column_name = 'organisation_id'
    `);

    if (colCheck.length === 0) {
      await queryRunner.query(`
        ALTER TABLE "dishes"
        ADD COLUMN "organisation_id" uuid NULL
      `);

      await queryRunner.query(`
        ALTER TABLE "dishes"
        ADD CONSTRAINT "FK_dishes_organisation_id"
        FOREIGN KEY ("organisation_id")
        REFERENCES "organisations"("id")
        ON DELETE CASCADE
      `);

      await queryRunner.query(`
        CREATE INDEX "IDX_dishes_organisation_id" ON "dishes" ("organisation_id")
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Supprimer l'index, la FK et la colonne sur dishes
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_dishes_organisation_id"`);
    await queryRunner.query(`ALTER TABLE "dishes" DROP CONSTRAINT IF EXISTS "FK_dishes_organisation_id"`);
    await queryRunner.query(`ALTER TABLE "dishes" DROP COLUMN IF EXISTS "organisation_id"`);

    // Note : PostgreSQL ne permet pas de supprimer une valeur d'enum directement.
    // Pour retirer SERVER, il faudrait recréer l'enum complet — non fait ici car risqué.
  }
}
