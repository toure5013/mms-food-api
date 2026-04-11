import { Repository } from 'typeorm';
import { LoyaltyTransaction } from './loyalty-transaction.entity';
import { User } from '../users/user.entity';
import { AddPointsDto, RedeemPointsDto } from './dto/loyalty.dto';
export declare class LoyaltyService {
    private readonly loyaltyRepo;
    private readonly userRepo;
    constructor(loyaltyRepo: Repository<LoyaltyTransaction>, userRepo: Repository<User>);
    getPoints(userId: string): Promise<{
        user_id: string;
        loyalty_points: number;
        loyalty_expires_at: Date;
    }>;
    getHistory(userId: string): Promise<LoyaltyTransaction[]>;
    addPoints(dto: AddPointsDto): Promise<{
        transaction: LoyaltyTransaction;
        total_points: number;
    }>;
    redeemPoints(userId: string, dto: RedeemPointsDto): Promise<{
        transaction: LoyaltyTransaction;
        total_points: number;
    }>;
    getLeaderboard(limit?: number): Promise<User[]>;
}
