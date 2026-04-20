import { Controller, Get, Post, Body, Param, Query, Patch, Delete, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateUserDto } from './dto/users.dto';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Liste des utilisateurs', description: 'Retourne la liste des utilisateurs. Un Admin Client ne voit que les employés de son organisation.' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'Filtrer par organisation (UUID)' })
  @ApiResponse({ status: 200, description: 'Liste retournée avec succès.' })
  @ApiResponse({ status: 403, description: 'Accès refusé — rôle insuffisant.' })
  findAll(@Query('organisation_id') orgId?: string, @Req() req?: any) {
    // Si c'est un Admin Client, on force le filtrage par son organisation
    const user = req?.user;
    if (user && user.role === UserRole.ADMIN_CLIENT) {
      return this.usersService.findAll(user.organisation_id);
    }
    return this.usersService.findAll(orgId);
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Créer / inviter un utilisateur', description: 'Crée un nouvel utilisateur et envoie un OTP par email pour la première connexion.' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès — OTP envoyé par email.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiResponse({ status: 409, description: 'Un utilisateur avec cet email existe déjà.' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
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
  @ApiOperation({ summary: 'Mettre à jour un utilisateur' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiParam({ name: 'id', description: 'UUID de l\'utilisateur' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
