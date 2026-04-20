import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';
import { Menu } from './menu.entity';
import { Dish } from '../dishes/dish.entity';
import { Organisation } from '../organisations/organisation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Dish, Organisation])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [MenusService],
})
export class MenusModule {}
