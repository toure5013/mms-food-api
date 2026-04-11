import { PaymentMethod, PaymentStatus } from '../common/enums/index';
import { Order } from '../orders/order.entity';
import { User } from '../users/user.entity';
export declare class Payment {
    id: string;
    reference: string;
    methode: PaymentMethod;
    statut: PaymentStatus;
    montant: number;
    telephone: string;
    provider_transaction_id: string;
    provider_response: string;
    error_message: string;
    order: Order;
    order_id: string;
    user: User;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
