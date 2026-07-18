import { Controller, Get, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';

@ApiTags('Admin - Base de données')
@ApiBearerAuth()
@Roles(UserRole.SUPER_ADMIN)
@Controller('admin/db')
export class AdminController {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  @Get('migrations/pending')
  @ApiOperation({ summary: 'Vérifie s\'il y a des migrations en attente' })
  @ApiResponse({ status: 200, description: 'Statut des migrations' })
  async pendingMigrations() {
    const hasPending = await this.dataSource.showMigrations();
    return { hasPending };
  }

  @Post('migrations/run')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Exécute toutes les migrations en attente' })
  @ApiResponse({ status: 200, description: 'Migrations exécutées avec succès' })
  async runMigrations() {
    const migrations = await this.dataSource.runMigrations({ transaction: 'all' });
    return {
      ran: migrations.length,
      migrations: migrations.map(m => ({ name: m.name, timestamp: m.timestamp })),
    };
  }

  @Post('patch/junction-columns')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Corrige les noms de colonnes des tables junction (snake_case → camelCase)' })
  async patchJunctionColumns() {
    const results: string[] = [];

    const columnExists = async (table: string, column: string): Promise<boolean> => {
      const [{ exists }] = await this.dataSource.query(
        `SELECT EXISTS (
          SELECT 1 FROM information_schema.columns
          WHERE table_name = $1 AND column_name = $2
        ) AS exists`,
        [table, column],
      );
      return exists;
    };

    await this.dataSource.transaction(async manager => {
      // order_dishes: orders_id → ordersId
      if (await columnExists('order_dishes', 'orders_id')) {
        await manager.query(`DROP INDEX IF EXISTS "IDX_order_dishes_orders_id"`);
        await manager.query(`DROP INDEX IF EXISTS "IDX_order_dishes_dishes_id"`);
        await manager.query(`ALTER TABLE "order_dishes" RENAME COLUMN "orders_id" TO "ordersId"`);
        await manager.query(`ALTER TABLE "order_dishes" RENAME COLUMN "dishes_id" TO "dishesId"`);
        await manager.query(`CREATE INDEX IF NOT EXISTS "IDX_order_dishes_ordersId" ON "order_dishes" ("ordersId")`);
        await manager.query(`CREATE INDEX IF NOT EXISTS "IDX_order_dishes_dishesId" ON "order_dishes" ("dishesId")`);
        results.push('order_dishes: orders_id→ordersId, dishes_id→dishesId ✓');
      } else {
        results.push('order_dishes: déjà en camelCase, rien à faire');
      }

      // menu_dishes: menus_id → menusId
      if (await columnExists('menu_dishes', 'menus_id')) {
        await manager.query(`DROP INDEX IF EXISTS "IDX_menu_dishes_menus_id"`);
        await manager.query(`DROP INDEX IF EXISTS "IDX_menu_dishes_dishes_id"`);
        await manager.query(`ALTER TABLE "menu_dishes" RENAME COLUMN "menus_id" TO "menusId"`);
        await manager.query(`ALTER TABLE "menu_dishes" RENAME COLUMN "dishes_id" TO "dishesId"`);
        await manager.query(`CREATE INDEX IF NOT EXISTS "IDX_menu_dishes_menusId" ON "menu_dishes" ("menusId")`);
        await manager.query(`CREATE INDEX IF NOT EXISTS "IDX_menu_dishes_dishesId" ON "menu_dishes" ("dishesId")`);
        results.push('menu_dishes: menus_id→menusId, dishes_id→dishesId ✓');
      } else {
        results.push('menu_dishes: déjà en camelCase, rien à faire');
      }
    });

    return { applied: results };
  }
}
