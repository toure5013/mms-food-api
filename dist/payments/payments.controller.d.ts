import { PaymentsService } from './payments.service';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(orderId?: string, userId?: string): Promise<import("./payment.entity").Payment[]>;
    findOne(id: string): Promise<import("./payment.entity").Payment>;
    create(dto: CreatePaymentDto): Promise<{
        checkout_url: string;
        id: string;
        reference: string;
        methode: import("../common/enums/index").PaymentMethod;
        statut: import("../common/enums/index").PaymentStatus;
        montant: number;
        telephone: string;
        provider_transaction_id: string;
        provider_response: string;
        error_message: string;
        order: import("../orders/order.entity").Order;
        order_id: string;
        user: import("../users/user.entity").User;
        user_id: string;
        created_at: Date;
        updated_at: Date;
    }>;
    handleWebhook(dto: WebhookPaymentDto): Promise<import("./payment.entity").Payment>;
    refund(id: string): Promise<import("./payment.entity").Payment>;
}
