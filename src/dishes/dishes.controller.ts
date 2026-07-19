import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { DishesService } from './dishes.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateDishDto, UpdateDishDto, CloneDishDto } from './dto/dishes.dto';

@ApiTags('Dishes')
@ApiBearerAuth('JWT-auth')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  @ApiOperation({ summary: 'Catalogue des plats', description: 'Retourne la liste complète des plats disponibles, avec leurs informations nutritionnelles et allergènes.' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'Filtrer par entreprise (réservé SUPER_ADMIN / ADMIN_MMS — ignoré pour les autres rôles)' })
  @ApiResponse({ status: 200, description: 'Liste des plats retournée.' })
  findAll(@Req() req: any, @Query('organisation_id') organisationId?: string) {
    return this.dishesService.findAll(req.user, organisationId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Ajouter un plat', description: 'Crée un nouveau plat dans le catalogue avec ses caractéristiques (catégorie, prix, allergènes, régimes alimentaires).' })
  @ApiResponse({ status: 201, description: 'Plat créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: CreateDishDto, @Req() req: any) {
    const user = req.user;
    const orgId = user?.role === UserRole.ADMIN_CLIENT ? user.organisation_id : undefined;
    return this.dishesService.create(dto, orgId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un plat', description: 'Retourne les informations complètes d\'un plat (description, prix, photo, allergènes, flags nutritionnels).' })
  @ApiParam({ name: 'id', description: 'UUID du plat' })
  @ApiResponse({ status: 200, description: 'Plat trouvé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    return this.dishesService.findOne(id, req.user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Modifier un plat', description: 'Met à jour les informations d\'un plat existant.' })
  @ApiParam({ name: 'id', description: 'UUID du plat' })
  @ApiResponse({ status: 200, description: 'Plat mis à jour.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  update(@Param('id') id: string, @Body() dto: UpdateDishDto, @Req() req: any) {
    return this.dishesService.update(id, dto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Désactiver un plat', description: 'Archive un plat (soft delete — is_active = false).' })
  @ApiParam({ name: 'id', description: 'UUID du plat' })
  @ApiResponse({ status: 200, description: 'Plat désactivé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.dishesService.remove(id, req.user);
  }

  @Post(':id/clone')
  @Roles(UserRole.ADMIN_CLIENT)
  @ApiOperation({
    summary: 'Copier un plat du catalogue MMS',
    description: 'Duplique un plat du catalogue commun (MMS) dans le catalogue de l\'entreprise, avec un prix et des caractéristiques diététiques propres à celle-ci.',
  })
  @ApiParam({ name: 'id', description: 'UUID du plat MMS à copier' })
  @ApiResponse({ status: 201, description: 'Plat copié dans le catalogue de l\'entreprise.' })
  @ApiResponse({ status: 403, description: 'Seuls les plats du catalogue commun MMS peuvent être copiés.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  clone(@Param('id') id: string, @Body() dto: CloneDishDto, @Req() req: any) {
    return this.dishesService.clone(id, dto, req.user);
  }
}
