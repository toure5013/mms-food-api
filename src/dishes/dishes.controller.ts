import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DishesService } from './dishes.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';
import { CreateDishDto } from './dto/dishes.dto';

@ApiTags('Dishes')
@ApiBearerAuth('JWT-auth')
@Controller('dishes')
export class DishesController {
  constructor(private readonly dishesService: DishesService) {}

  @Get()
  @ApiOperation({ summary: 'Catalogue des plats', description: 'Retourne la liste complète des plats disponibles, avec leurs informations nutritionnelles et allergènes.' })
  @ApiResponse({ status: 200, description: 'Liste des plats retournée.' })
  findAll() {
    return this.dishesService.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Ajouter un plat', description: 'Crée un nouveau plat dans le catalogue avec ses caractéristiques (catégorie, prix, allergènes, régimes alimentaires).' })
  @ApiResponse({ status: 201, description: 'Plat créé avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: CreateDishDto) {
    return this.dishesService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'un plat', description: 'Retourne les informations complètes d\'un plat (description, prix, photo, allergènes, flags nutritionnels).' })
  @ApiParam({ name: 'id', description: 'UUID du plat' })
  @ApiResponse({ status: 200, description: 'Plat trouvé.' })
  @ApiResponse({ status: 404, description: 'Plat non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.dishesService.findOne(id);
  }
}
