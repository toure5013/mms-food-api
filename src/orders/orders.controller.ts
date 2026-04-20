import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des commandes', description: 'Retourne la liste des commandes, filtrable par organisation, employé et statut.' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'UUID de l\'organisation' })
  @ApiQuery({ name: 'employe_id', required: false, description: 'UUID de l\'employé' })
  @ApiQuery({ name: 'statut', required: false, description: 'Filtrer par statut (PENDING, CONFIRMED, PAID, etc.)' })
  @ApiResponse({ status: 200, description: 'Liste des commandes retournée.' })
  findAll(
    @Query('organisation_id') organisationId?: string,
    @Query('employe_id') employeId?: string,
    @Query('statut') statut?: string,
  ) {
    return this.ordersService.findAll(organisationId, employeId, statut);
  }

  @Get('stats/:organisationId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Statistiques des commandes', description: 'Retourne les statistiques de commandes pour une organisation donnée (Total, Aujourd\'hui, etc.).' })
  @ApiParam({ name: 'organisationId', description: 'UUID de l\'organisation' })
  @ApiResponse({ status: 200, description: 'Statistiques retournées.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  getStats(@Param('organisationId') organisationId: string) {
    return this.ordersService.getStats(organisationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une commande', description: 'Retourne les détails complets d\'une commande par son UUID.' })
  @ApiParam({ name: 'id', description: 'UUID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande trouvée.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN_CLIENT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une commande', description: 'Crée une nouvelle commande, génère un numéro unique et un token de QR code.' })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou solde insuffisant.' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.COOK)
  @ApiOperation({ summary: 'Mettre à jour le statut', description: 'Modifie le statut d\'une commande (ex: passer de READY à RETRIEVED).' })
  @ApiParam({ name: 'id', description: 'UUID de la commande' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Post('retrieve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Retrait par scan QR code', description: 'Marque une commande comme récupérée en utilisant le token du QR code.' })
  @ApiResponse({ status: 200, description: 'Commande marquée comme récupérée.' })
  @ApiResponse({ status: 400, description: 'Token QR code invalide ou commande déjà récupérée/annulée.' })
  retrieveByQrCode(@Body() dto: RetrieveOrderDto) {
    return this.ordersService.retrieveByQrCode(dto);
  }
}
