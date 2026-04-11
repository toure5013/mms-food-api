import { LoyaltyTransactionType } from '../loyalty-transaction.entity';
export declare class AddPointsDto {
    user_id: string;
    points: number;
    type?: LoyaltyTransactionType;
    description?: string;
    reference?: string;
}
export declare class RedeemPointsDto {
    points: number;
    description?: string;
}
