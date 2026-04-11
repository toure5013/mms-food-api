import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { Menu } from './menu.entity';
import { Dish } from '../dishes/dish.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Dish])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
