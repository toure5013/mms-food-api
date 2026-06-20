import { Controller, Get, Post, Body, Param, Query, Patch, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateUserDto, UpdateUserDto } from './dto/users.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Liste des utilisateurs', description: 'Retourne la liste des utilisateurs. Un Admin Client ne voit que les membres de son organisation.' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'Filtrer par organisation — SUPER_ADMIN uniquement (UUID)' })
  @ApiQuery({ name: 'role', required: false, enum: UserRole, description: 'Filtrer par rôle (ex: SERVER, COOK, EMPLOYEE)' })
  @ApiResponse({ status: 200, description: 'Liste retournée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé — rôle insuffisant.' })
  findAll(@Query('organisation_id') orgId?: string, @Query('role') role?: UserRole, @Req() req?: any) {
    const user = req?.user;
    if (user?.role === UserRole.ADMIN_CLIENT) {
      return this.usersService.findAll(user.organisation_id, role);
    }
    return this.usersService.findAll(orgId, role);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Créer / inviter un utilisateur', description: 'Crée un nouvel utilisateur et envoie un OTP par email pour la première connexion. Un ADMIN_CLIENT ne peut créer que des EMPLOYEE, COOK ou SERVER dans sa propre organisation.' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès — OTP envoyé par email.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 403, description: 'Rôle non autorisé pour un admin client.' })
  @ApiResponse({ status: 409, description: 'Un utilisateur avec cet email existe déjà.' })
  create(@Body() dto: CreateUserDto, @Req() req: any) {
    return this.usersService.create(dto, req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un utilisateur', description: 'Retourne les informations complètes d\'un utilisateur par son UUID.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé.' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un utilisateur', description: 'Un Admin Client ne peut modifier que les membres de sa propre organisation.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur mis à jour.' })
  @ApiResponse({ status: 403, description: 'Accès refusé — utilisateur hors de votre organisation.' })
  update(@Param('id') id: string, @Body() dto: UpdateUserDto, @Req() req: any) {
    return this.usersService.update(id, dto, req.user);
  }

  @Patch(':id/toggle-active')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Activer / désactiver un utilisateur', description: 'Bascule l\'état actif/inactif d\'un membre. Un Admin Client ne peut agir que sur les membres de sa propre organisation.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Statut basculé.' })
  @ApiResponse({ status: 403, description: 'Accès refusé — utilisateur hors de votre organisation.' })
  toggleActive(@Param('id') id: string, @Req() req: any) {
    return this.usersService.toggleActive(id, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur (hard delete)', description: 'Suppression définitive — SUPER_ADMIN uniquement. Préférer toggle-active pour désactiver.' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
