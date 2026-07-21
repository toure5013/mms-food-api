import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderStatusDisplayToOrganisation1784616812000 implements MigrationInterface {
  name = 'AddOrderStatusDisplayToOrganisation1784616812000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "organisations_order_status_display_enum" AS ENUM('DETAILED', 'SIMPLIFIED')
    `);
    await queryRunner.query(`
      ALTER TABLE "organisations"
      ADD COLUMN "order_status_display" "organisations_order_status_display_enum" NOT NULL DEFAULT 'DETAILED'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organisations" DROP COLUMN "order_status_display"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "organisations_order_status_display_enum"`);
  }
}
