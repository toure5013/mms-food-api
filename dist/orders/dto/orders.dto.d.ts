import { MealSlot, OrderStatus, PaymentMethod } from '../../common/enums/index';
export declare class CreateOrderDto {
    employe_id: string;
    organisation_id: string;
    creneau: MealSlot;
    date_livraison: string;
    plats_ids: string[];
    methode_paiement?: PaymentMethod;
}
export declare class UpdateOrderStatusDto {
    statut: OrderStatus;
}
export declare class RetrieveOrderDto {
    qr_code_token: string;
    recupere_par?: string;
}
