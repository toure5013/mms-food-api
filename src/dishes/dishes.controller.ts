import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DishesService } from './dishes.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateDishDto } from './dto/dishes.dto';

@ApiTags('Dishes')
@ApiBearerAuth()
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  @ApiOperation({ summary: 'Catalogue des plats' })
  findAll() {
    return this.dishesService.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Ajouter un plat' })
  create(@Body() dto: CreateDishDto) {
    return this.dishesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un plat' })
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(id);
  }
}
