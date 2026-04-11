import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto, PublishMenuDto } from './dto/menus.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Menus')
@ApiBearerAuth()
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des menus (filtrable par organisation et date)' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'Filtrer par organisation' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrer par date (YYYY-MM-DD)' })
  findAll(
    @Query('organisation_id') organisationId?: string,
    @Query('date') date?: string,
  ) {
    return this.menusService.findAll(organisationId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un menu' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Créer un menu avec ses plats' })
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un menu' })
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Publier ou dépublier un menu' })
  publish(@Param('id') id: string, @Body() dto: PublishMenuDto) {
    return this.menusService.publish(id, dto.is_published);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un menu' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
