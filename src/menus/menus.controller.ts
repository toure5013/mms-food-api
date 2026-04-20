import { Controller, Get, Post, Put, Patch, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { MenusService } from './menus.service';
import { CreateMenuDto, UpdateMenuDto, PublishMenuDto } from './dto/menus.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Menus')
@ApiBearerAuth('JWT-auth')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('daily')
  @ApiOperation({ summary: 'Plats du jour', description: 'Retourne la liste complète des plats disponibles pour une date donnée (filtré par organisation).' })
  @ApiQuery({ name: 'date', required: true, description: 'Date au format YYYY-MM-DD' })
  @ApiResponse({ status: 200, description: 'Liste des plats retournée.' })
  findDaily(
    @Query('date') date: string,
    @Req() req: any,
  ) {
    const organisationId = req.user?.organisation_id;
    return this.menusService.findDailyDishes(date, organisationId);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des menus', description: 'Retourne la liste des menus planifiés, filtrable par organisation et/ou par date.' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'Filtrer par organisation (UUID)' })
  @ApiQuery({ name: 'date', required: false, description: 'Filtrer par date (format YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Liste des menus retournée.' })
  findAll(
    @Query('organisation_id') organisationId?: string,
    @Query('date') date?: string,
  ) {
    return this.menusService.findAll(organisationId, date);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un menu', description: 'Retourne un menu avec la liste de ses plats associés.' })
  @ApiParam({ name: 'id', description: 'UUID du menu' })
  @ApiResponse({ status: 200, description: 'Menu trouvé avec ses plats.' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.menusService.findOne(id);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Créer un menu', description: 'Crée un nouveau menu pour une date et un créneau donné, et associe les plats sélectionnés.' })
  @ApiResponse({ status: 201, description: 'Menu créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides (date passée, créneau invalide, etc.).' })
  @ApiResponse({ status: 409, description: 'Un menu existe déjà pour cette date/créneau/organisation.' })
  create(@Body() dto: CreateMenuDto) {
    return this.menusService.create(dto);
  }

  @Put(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un menu', description: 'Remplace entièrement la configuration d\'un menu existant.' })
  @ApiParam({ name: 'id', description: 'UUID du menu' })
  @ApiResponse({ status: 200, description: 'Menu mis à jour.' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  update(@Param('id') id: string, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Patch(':id/publish')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Publier / dépublier un menu', description: 'Change la visibilité d\'un menu. Un menu publié est visible par les employés pour passer commande.' })
  @ApiParam({ name: 'id', description: 'UUID du menu' })
  @ApiResponse({ status: 200, description: 'Statut de publication mis à jour.' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  publish(@Param('id') id: string, @Body() dto: PublishMenuDto) {
    return this.menusService.publish(id, dto.is_published);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un menu', description: 'Supprime définitivement un menu et ses associations aux plats.' })
  @ApiParam({ name: 'id', description: 'UUID du menu' })
  @ApiResponse({ status: 200, description: 'Menu supprimé.' })
  @ApiResponse({ status: 404, description: 'Menu non trouvé.' })
  remove(@Param('id') id: string) {
    return this.menusService.remove(id);
  }
}
