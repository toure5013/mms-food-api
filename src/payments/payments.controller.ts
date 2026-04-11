import { Controller, Get, Post, Patch, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Liste des paiements (filtrable par commande ou utilisateur)' })
  @ApiQuery({ name: 'order_id', required: false })
  @ApiQuery({ name: 'user_id', required: false })
  findAll(
    @Query('order_id') orderId?: string,
    @Query('user_id') userId?: string,
  ) {
    return this.paymentsService.findAll(orderId, userId);
  }

  @Get(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Détails d\'un paiement' })
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @Roles(UserRole.EMPLOYEE, UserRole.ADMIN_CLIENT, UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Initier un paiement pour une commande' })
  create(@Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(dto);
  }

  @Post('webhook')
  @Public()
  @ApiOperation({ summary: 'Callback webhook du provider de paiement (Wave, Orange Money, etc.)' })
  handleWebhook(@Body() dto: WebhookPaymentDto) {
    return this.paymentsService.handleWebhook(dto);
  }

  @Patch(':id/refund')
  @ApiBearerAuth()
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({ summary: 'Rembourser un paiement' })
  refund(@Param('id') id: string) {
    return this.paymentsService.refund(id);
  }
}
