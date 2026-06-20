import { Repository } from 'typeorm';
import { Payment } from './payment.entity';
import { Order } from '../orders/order.entity';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
import { PaymentStatus } from '../common/enums/index';
import { PaymentProviderService } from './payment-provider.service';
export declare class PaymentsService {
    private readonly paymentRepo;
    private readonly orderRepo;
    private readonly providerService;
    constructor(paymentRepo: Repository<Payment>, orderRepo: Repository<Order>, providerService: PaymentProviderService);
    findAll(orderId?: string, userId?: string): Promise<Payment[]>;
    findOne(id: string): Promise<Payment>;
    create(dto: CreatePaymentDto): Promise<{
        checkout_url: string;
        id: string;
        reference: string;
        methode: import("../common/enums/index").PaymentMethod;
        statut: PaymentStatus;
        montant: number;
        telephone: string;
        provider_transaction_id: string;
        provider_response: string;
        error_message: string;
        order: Order;
        order_id: string;
        user: import("../users/user.entity").User;
        user_id: string;
        created_at: Date;
        updated_at: Date;
    }>;
    handleWebhook(dto: WebhookPaymentDto): Promise<Payment>;
    refund(id: string): Promise<Payment>;
}
