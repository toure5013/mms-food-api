import { Controller, Get, Post, Patch, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, CreateGuestOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT, UserRole.COOK, UserRole.SERVER)
  @ApiOperation({ summary: 'Liste des commandes', description: 'Retourne la liste des commandes. Un ADMIN_CLIENT ne voit que les commandes de son organisation.' })
  @ApiQuery({ name: 'organisation_id', required: false, description: 'UUID de l\'organisation — SUPER_ADMIN/ADMIN_MMS uniquement' })
  @ApiQuery({ name: 'employe_id', required: false, description: 'UUID de l\'employé' })
  @ApiQuery({ name: 'statut', required: false, description: 'Filtrer par statut (PENDING, CONFIRMED, PAID, etc.)' })
  @ApiResponse({ status: 200, description: 'Liste des commandes retournée.' })
  findAll(
    @Query('organisation_id') organisationId?: string,
    @Query('employe_id') employeId?: string,
    @Query('statut') statut?: string,
    @Req() req?: any,
  ) {
    const user = req?.user;
    if (user?.role === UserRole.ADMIN_CLIENT) {
      return this.ordersService.findAll(user.organisation_id, employeId, statut);
    }
    if (user?.role === UserRole.COOK || user?.role === UserRole.SERVER) {
      return this.ordersService.findAll(user.organisation_id, undefined, statut);
    }
    return this.ordersService.findAll(organisationId, employeId, statut);
  }

  @Get('stats/:organisationId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Statistiques des commandes', description: 'Retourne les statistiques de commandes pour une organisation donnée (Total, Aujourd\'hui, etc.).' })
  @ApiParam({ name: 'organisationId', description: 'UUID de l\'organisation' })
  @ApiResponse({ status: 200, description: 'Statistiques retournées.' })
  @ApiResponse({ status: 403, description: 'Accès refusé.' })
  getStats(@Param('organisationId') organisationId: string) {
    return this.ordersService.getStats(organisationId);
  }

  @Get('my-orders')
  @ApiOperation({ summary: 'Commandes de l\'utilisateur connecté' })
  findMyOrders(@Req() req: any) {
    // req.user est injecté automatiquement par votre Guard JWT (Passport)
    const employeId = req.user.id;
    return this.ordersService.findMyOrders(employeId);
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
  create(@Body() dto: CreateOrderDto, @Req() req: any) {
    // Toujours utiliser l'id JWT — le client ne doit pas pouvoir l'usurper
    dto.employe_id = req.user?.id;
    return this.ordersService.create(dto);
  }

  @Public()
  @Post('guest')
  @ApiOperation({ summary: 'Créer une commande invité', description: 'Permet à un invité de commander sans compte.' })
  @ApiResponse({ status: 201, description: 'Commande créée avec succès.' })
  @ApiResponse({ status: 400, description: 'Données invalides ou créneau fermé.' })
  createGuest(@Body() dto: CreateGuestOrderDto) {
    return this.ordersService.createGuestOrder(dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT, UserRole.COOK, UserRole.SERVER)
  @ApiOperation({ summary: 'Mettre à jour le statut (PATCH)', description: 'Modifie le statut d\'une commande (ex: passer de READY à RETRIEVED). Accessible aux admins et au personnel de distribution.' })
  @ApiParam({ name: 'id', description: 'UUID de la commande' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  updateStatusPatch(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Post(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT, UserRole.COOK, UserRole.SERVER)
  @ApiOperation({ summary: 'Mettre à jour le statut (POST - Fallback Flutter)', description: 'Modifie le statut d\'une commande pour compatibilité mobile.' })
  @ApiParam({ name: 'id', description: 'UUID de la commande' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour.' })
  @ApiResponse({ status: 404, description: 'Commande non trouvée.' })
  updateStatusPost(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }


  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Annuler une commande', description: 'Annule une commande au statut PENDING ou CONFIRMED.' })
  @ApiParam({ name: 'id', description: 'UUID de la commande' })
  @ApiResponse({ status: 200, description: 'Commande annulée.' })
  @ApiResponse({ status: 400, description: 'Commande non annulable à ce statut.' })
  cancel(@Param('id') id: string, @Req() req: any) {
    return this.ordersService.cancel(id, req.user.id);
  }

  @Post('retrieve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT, UserRole.SERVER)
  @ApiOperation({ summary: 'Retrait par scan QR code', description: 'Marque une commande comme récupérée en utilisant le token du QR code. Accessible aux serveurs et admins.' })
  @ApiResponse({ status: 200, description: 'Commande marquée comme récupérée.' })
  @ApiResponse({ status: 400, description: 'Token QR code invalide ou commande déjà récupérée/annulée.' })
  retrieveByQrCode(@Body() dto: RetrieveOrderDto) {
    return this.ordersService.retrieveByQrCode(dto);
  }
}
