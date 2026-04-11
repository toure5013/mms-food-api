import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, RetrieveOrderDto } from './dto/orders.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Liste des commandes (filtrable par organisation, employé, statut)' })
  @ApiQuery({ name: 'organisation_id', required: false })
  @ApiQuery({ name: 'employe_id', required: false })
  @ApiQuery({ name: 'statut', required: false })
  findAll(
    @Query('organisation_id') organisationId?: string,
    @Query('employe_id') employeId?: string,
    @Query('statut') statut?: string,
  ) {
    return this.ordersService.findAll(organisationId, employeId, statut);
  }

  @Get('stats/:organisationId')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_CLIENT)
  @ApiOperation({ summary: 'Statistiques des commandes par organisation' })
  getStats(@Param('organisationId') organisationId: string) {
    return this.ordersService.getStats(organisationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Détails d\'une commande' })
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN_CLIENT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Créer une commande (génère QR code + numéro)' })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }

  @Patch(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.COOK)
  @ApiOperation({ summary: 'Mettre à jour le statut d\'une commande' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateStatus(id, dto);
  }

  @Post('retrieve')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @ApiOperation({ summary: 'Retrait par scan QR code — marque la commande comme récupérée' })
  retrieveByQrCode(@Body() dto: RetrieveOrderDto) {
    return this.ordersService.retrieveByQrCode(dto);
  }
}
