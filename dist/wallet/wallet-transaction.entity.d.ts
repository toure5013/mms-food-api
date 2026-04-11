import { Wallet } from './wallet.entity';
export declare enum TransactionType {
    CREDIT = "CREDIT",
    DEBIT = "DEBIT"
}
export declare class WalletTransaction {
    id: string;
    type: TransactionType;
    montant: number;
    solde_apres: number;
    description: string;
    reference: string;
    wallet: Wallet;
    wallet_id: string;
    created_at: Date;
}
