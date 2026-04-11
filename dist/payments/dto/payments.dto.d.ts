import { PaymentMethod } from '../../common/enums/index';
export declare class CreatePaymentDto {
    order_id: string;
    user_id: string;
    methode: PaymentMethod;
    montant: number;
    telephone?: string;
}
export declare class WebhookPaymentDto {
    transaction_id: string;
    reference: string;
    status: string;
    provider?: string;
    amount?: number;
}
