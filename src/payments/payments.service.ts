import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
import { PaymentStatus, OrderStatus } from '../common/enums/index';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  findAll(orderId?: string, userId?: string) {
    const where: any = {};
    if (orderId) where.order_id = orderId;
    if (userId) where.user_id = userId;

    return this.paymentRepo.find({
      where,
      relations: ['order', 'user'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['order', 'user'],
    });
    if (!payment) throw new NotFoundException('Paiement introuvable');
    return payment;
  }

  async create(dto: CreatePaymentDto) {
    // Vérifier que la commande existe
    const order = await this.orderRepo.findOne({ where: { id: dto.order_id } });
    if (!order) throw new NotFoundException('Commande introuvable');

    // Vérifier que la commande est en attente de paiement
    if (order.statut !== OrderStatus.CONFIRMED && order.statut !== OrderStatus.PENDING) {
      throw new BadRequestException(
        `La commande n'est pas en attente de paiement (statut: ${order.statut})`,
      );
    }

    // Générer une référence unique
    const reference = `PAY-MMS-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0, 4).toUpperCase()}`;

    const payment = this.paymentRepo.create({
      ...dto,
      reference,
      statut: PaymentStatus.PENDING,
    });

    return this.paymentRepo.save(payment);
  }

  async handleWebhook(dto: WebhookPaymentDto) {
    const payment = await this.paymentRepo.findOne({
      where: { reference: dto.reference },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('Paiement introuvable pour cette référence');

    payment.provider_transaction_id = dto.transaction_id;
    payment.provider_response = JSON.stringify(dto);

    if (dto.status === 'SUCCESS') {
      payment.statut = PaymentStatus.SUCCESS;

      // Mettre à jour le statut de la commande
      if (payment.order) {
        payment.order.statut = OrderStatus.PAID;
        await this.orderRepo.save(payment.order);
      }
    } else {
      payment.statut = PaymentStatus.FAILED;
      payment.error_message = `Paiement échoué via ${dto.provider || 'inconnu'}`;
    }

    return this.paymentRepo.save(payment);
  }

  async refund(id: string) {
    const payment = await this.findOne(id);

    if (payment.statut !== PaymentStatus.SUCCESS) {
      throw new BadRequestException('Seuls les paiements réussis peuvent être remboursés');
    }

    payment.statut = PaymentStatus.REFUNDED;
    return this.paymentRepo.save(payment);
  }
}
