import { Controller, Get, Post, Body, Param, Patch, Delete, Req, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrganisationsService } from './organisations.service';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/index';
import { CreateOrganisationDto, UpdateOrganisationDto, UpdateGuestModeDto } from './dto/organisations.dto';

@ApiTags('Organisations')
@ApiBearerAuth('JWT-auth')
@Controller('organisations')
export class OrganisationsController {
  constructor(private readonly organisationsService: OrganisationsService) {}

  @Public()
  @Get('public/:slug')
  @ApiOperation({ summary: 'Infos publiques d\'une organisation', description: 'Retourne les infos de base (logo, config invité) d\'une entreprise par son slug.' })
  @ApiParam({ name: 'slug', description: 'Slug de l\'organisation' })
  findPublic(@Param('slug') slug: string) {
    return this.organisationsService.findBySlugPublic(slug);
  }

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

  @Get('my')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Mon organisation', description: 'Retourne les informations complètes de l\'organisation de l\'admin connecté, sans avoir à connaître son UUID.' })
  @ApiResponse({ status: 200, description: 'Organisation retournée.' })
  @ApiResponse({ status: 403, description: 'Aucune organisation associée à ce compte.' })
  findMine(@Req() req: any) {
    const orgId = req.user.organisation_id;
    if (!orgId) throw new ForbiddenException('Aucune organisation associée à ce compte');
    return this.organisationsService.findOne(orgId);
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

  @Patch('my/guest-mode')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Activer / désactiver le mode invité', description: 'Permet à un admin de toggler les commandes sans connexion (QR code) pour son organisation.' })
  @ApiResponse({ status: 200, description: 'Mode invité mis à jour.' })
  @ApiResponse({ status: 403, description: 'Aucune organisation associée à cet utilisateur.' })
  updateGuestMode(@Body() dto: UpdateGuestModeDto, @Req() req: any) {
    const orgId = req.user.organisation_id;
    if (!orgId) throw new ForbiddenException('Aucune organisation associée à ce compte');
    return this.organisationsService.updateGuestMode(orgId, dto);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Mettre à jour une organisation', description: 'Modifie la configuration d\'une organisation. Un Admin Client ne peut modifier que sa propre organisation.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'organisation' })
  @ApiResponse({ status: 200, description: 'Organisation mise à jour.' })
  @ApiResponse({ status: 403, description: 'Accès refusé à cette organisation.' })
  @ApiResponse({ status: 404, description: 'Organisation non trouvée.' })
  update(@Param('id') id: string, @Body() dto: UpdateOrganisationDto, @Req() req: any) {
    const user = req.user;
    if (user.role === UserRole.ADMIN_CLIENT && user.organisation_id !== id) {
      throw new ForbiddenException('Accès refusé — vous ne pouvez modifier que votre propre organisation');
    }
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
