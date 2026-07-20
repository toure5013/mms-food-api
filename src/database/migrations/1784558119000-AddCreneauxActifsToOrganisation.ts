import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCreneauxActifsToOrganisation1784558119000 implements MigrationInterface {
  name = 'AddCreneauxActifsToOrganisation1784558119000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "organisations"
      ADD COLUMN "creneaux_actifs" text NOT NULL DEFAULT 'MORNING,NOON,EVENING,SNACK'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "organisations" DROP COLUMN "creneaux_actifs"`);
  }
}
