import { PaymentMethod } from '../../common/enums/index';
export declare class CreditWalletDto {
    montant: number;
    methode_paiement: PaymentMethod;
    telephone?: string;
}
export declare class DebitWalletDto {
    montant: number;
    description?: string;
    reference?: string;
}
