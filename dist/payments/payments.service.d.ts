import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
export declare class PaymentsService {
    private readonly paymentRepo;
    private readonly orderRepo;
    constructor(paymentRepo: Repository<Payment>, orderRepo: Repository<Order>);
    findAll(orderId?: string, userId?: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    create(dto: CreatePaymentDto): Promise<Payment>;
    handleWebhook(dto: WebhookPaymentDto): Promise<Payment>;
    refund(id: string): Promise<Payment>;
}
