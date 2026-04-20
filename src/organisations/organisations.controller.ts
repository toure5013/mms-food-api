import { Controller, Get, Post, Body, Param, Patch, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrganisationsService } from './organisations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateOrganisationDto, UpdateOrganisationDto } from './dto/organisations.dto';

@ApiTags('Organisations')
@ApiBearerAuth('JWT-auth')
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Liste toutes les organisations', description: 'Retourne la liste complète des entreprises clientes. Réservé au Super Admin.' })
  @ApiResponse({ status: 200, description: 'Liste des organisations retournée.' })
  @ApiResponse({ status: 403, description: 'Accès refusé — rôle SUPER_ADMIN requis.' })
  findAll() {
    return this.organisationsService.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une organisation', description: 'Enregistre une nouvelle entreprise cliente avec sa configuration (subventions, composition menu, branding).' })
  @ApiResponse({ status: 201, description: 'Organisation créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 409, description: 'Une organisation avec ce slug existe déjà.' })
  create(@Body() dto: CreateOrganisationDto) {
    return this.organisationsService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une organisation', description: 'Retourne les informations complètes d\'une organisation. Un utilisateur non-admin ne peut voir que sa propre organisation.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'organisation' })
  @ApiResponse({ status: 200, description: 'Organisation trouvée.' })
  @ApiResponse({ status: 403, description: 'Accès refusé à cette organisation.' })
  @ApiResponse({ status: 404, description: 'Organisation non trouvée.' })
  findOne(@Param('id') id: string, @Req() req: any) {
    const user = req.user;
    if (user.role !== UserRole.SUPER_ADMIN && user.role !== UserRole.ADMIN_MMS) {
      if (user.organisation_id !== id) {
        throw new ForbiddenException('Accès refusé à cette organisation');
      }
    }
    return this.organisationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Mettre à jour une organisation', description: 'Modifie partiellement la configuration d\'une organisation (nom, branding, subventions, etc.).' })
  @ApiParam({ name: 'id', description: 'UUID de l\'organisation' })
  @ApiResponse({ status: 200, description: 'Organisation mise à jour.' })
  @ApiResponse({ status: 404, description: 'Organisation non trouvée.' })
  update(@Param('id') id: string, @Body() dto: UpdateOrganisationDto) {
    return this.organisationsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer une organisation', description: 'Supprime définitivement une organisation et toutes ses données associées.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'organisation' })
  @ApiResponse({ status: 200, description: 'Organisation supprimée.' })
  @ApiResponse({ status: 404, description: 'Organisation non trouvée.' })
  remove(@Param('id') id: string) {
    return this.organisationsService.remove(id);
  }
}
