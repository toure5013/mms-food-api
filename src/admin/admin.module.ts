import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { AdminController } from './admin.controller';
import { BootstrapController } from './bootstrap.controller';
import { BootstrapService } from './bootstrap.service';

import { User } from '../users/user.entity';
import { Organisation } from '../organisations/organisation.entity';
import { Dish } from '../dishes/dish.entity';
import { Menu } from '../menus/menu.entity';
import { Settings } from '../settings/settings.entity';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([User, Organisation, Dish, Menu, Settings]),
  ],
  controllers: [AdminController, BootstrapController],
  providers: [BootstrapService],
})
export class AdminModule {}
