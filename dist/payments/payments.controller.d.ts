import { PaymentsService } from './payments.service';
import { CreatePaymentDto, WebhookPaymentDto } from './dto/payments.dto';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    findAll(orderId?: string, userId?: string): Promise<import("./payment.entity").Payment[]>;
    findOne(id: string): Promise<import("./payment.entity").Payment>;
    create(dto: CreatePaymentDto): Promise<import("./payment.entity").Payment>;
    handleWebhook(dto: WebhookPaymentDto): Promise<import("./payment.entity").Payment>;
    refund(id: string): Promise<import("./payment.entity").Payment>;
}
