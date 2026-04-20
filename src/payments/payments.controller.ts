import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Liste des paiements', description: 'Retourne l\'historique des paiements, filtrable par commande ou utilisateur.' })
  @ApiQuery({ name: 'order_id', required: false, description: 'UUID de la commande' })
  @ApiQuery({ name: 'user_id', required: false, description: 'UUID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des paiements retournée.' })
  findAll(
    @Query('order_id') orderId?: string,
    @Query('user_id') userId?: string,
  ) {
    return this.paymentsService.findAll(orderId, userId);
  }

  @Get(':id')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Détails d\'un paiement', description: 'Retourne les informations d\'une transaction spécifique.' })
  @ApiParam({ name: 'id', description: 'UUID du paiement' })
  @ApiResponse({ status: 200, description: 'Paiement trouvé.' })
  @ApiResponse({ status: 404, description: 'Paiement non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN_CLIENT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Initier un paiement', description: 'Crée une transaction de paiement pour une commande (Wave, Orange Money, etc.).' })
  @ApiResponse({ status: 201, description: 'Paiement initié.' })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Callback Webhook', description: 'Réception des notifications de succès/échec de la part du provider de paiement.' })
  @ApiResponse({ status: 200, description: 'Webhook traité.' })
  handleWebhook(@Body() dto: WebhookPaymentDto) {
    return this.paymentsService.handleWebhook(dto);
  }

  @Patch(':id/refund')
  @ApiBearerAuth('JWT-auth')
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rembourser un paiement', description: 'Initie une procédure de remboursement pour une transaction donnée.' })
  @ApiParam({ name: 'id', description: 'UUID du paiement' })
  @ApiResponse({ status: 200, description: 'Remboursement traité.' })
  @ApiResponse({ status: 404, description: 'Paiement non trouvé.' })
  refund(@Param('id') id: string) {
    return this.paymentsService.refund(id);
  }
}
