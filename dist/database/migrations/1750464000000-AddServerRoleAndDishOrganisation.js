"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddServerRoleAndDishOrganisation1750464000000 = void 0;
class AddServerRoleAndDishOrganisation1750464000000 {
    name = 'AddServerRoleAndDishOrganisation1750464000000';
    async up(queryRunner) {
        const enumCheck = await queryRunner.query(`
      SELECT 1 FROM pg_enum
      JOIN pg_type ON pg_type.oid = pg_enum.enumtypid
      WHERE pg_type.typname LIKE '%role%'
        AND pg_enum.enumlabel = 'SERVER'
    `);
        if (enumCheck.length === 0) {
            await queryRunner.query(`ALTER TYPE "users_role_enum" ADD VALUE 'SERVER'`);
        }
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
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX IF EXISTS "IDX_dishes_organisation_id"`);
        await queryRunner.query(`ALTER TABLE "dishes" DROP CONSTRAINT IF EXISTS "FK_dishes_organisation_id"`);
        await queryRunner.query(`ALTER TABLE "dishes" DROP COLUMN IF EXISTS "organisation_id"`);
    }
}
exports.AddServerRoleAndDishOrganisation1750464000000 = AddServerRoleAndDishOrganisation1750464000000;
//# sourceMappingURL=1750464000000-AddServerRoleAndDishOrganisation.js.map