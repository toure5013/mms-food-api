import { User } from '../users/user.entity';
export declare enum LoyaltyTransactionType {
    EARNED = "EARNED",
    REDEEMED = "REDEEMED",
    EXPIRED = "EXPIRED",
    BONUS = "BONUS"
}
export declare class LoyaltyTransaction {
    id: string;
    type: LoyaltyTransactionType;
    points: number;
    description: string;
    reference: string;
    user: User;
    user_id: string;
    created_at: Date;
}
