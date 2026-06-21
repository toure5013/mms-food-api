import { Controller, Get, Post, Patch, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
import { Roles } from '../common/decorators/roles.decorator';
import { Public } from '../common/decorators/public.decorator';
import { UserRole } from '../common/enums/index';

@ApiTags('Payments')
@ApiBearerAuth('JWT-auth')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Liste des paiements', description: 'Retourne l\'historique des paiements. EMPLOYEE ne voit que ses propres paiements. ADMIN_CLIENT filtre par user_id ou order_id dans son organisation.' })
  @ApiQuery({ name: 'order_id', required: false, description: 'UUID de la commande' })
  @ApiQuery({ name: 'user_id', required: false, description: 'UUID de l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Liste des paiements retournée.' })
  findAll(
    @Query('order_id') orderId?: string,
    @Query('user_id') userId?: string,
    @Req() req?: any,
  ) {
    const user = req?.user;
    if (user?.role === UserRole.EMPLOYEE) {
      return this.paymentsService.findAll(orderId, user.id);
    }
    return this.paymentsService.findAll(orderId, userId);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS, UserRole.ADMIN_CLIENT, UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Détails d\'un paiement', description: 'Retourne les informations d\'une transaction spécifique.' })
  @ApiParam({ name: 'id', description: 'UUID du paiement' })
  @ApiResponse({ status: 200, description: 'Paiement trouvé.' })
  @ApiResponse({ status: 404, description: 'Paiement non trouvé.' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
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
