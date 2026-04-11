import { User } from '../users/user.entity';
export declare class Wallet {
    id: string;
    solde: number;
    is_active: boolean;
    user: User;
    user_id: string;
    created_at: Date;
    updated_at: Date;
}
