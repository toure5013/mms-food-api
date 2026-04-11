import { LoyaltyService } from './loyalty.service';
import { AddPointsDto, RedeemPointsDto } from './dto/loyalty.dto';
export declare class LoyaltyController {
    private readonly loyaltyService;
    constructor(loyaltyService: LoyaltyService);
    getPoints(req: any): Promise<{
        user_id: string;
        loyalty_points: number;
        loyalty_expires_at: Date;
    }>;
    getHistory(req: any): Promise<import("./loyalty-transaction.entity").LoyaltyTransaction[]>;
    getLeaderboard(limit?: number): Promise<import("../users/user.entity").User[]>;
    addPoints(dto: AddPointsDto): Promise<{
        transaction: import("./loyalty-transaction.entity").LoyaltyTransaction;
        total_points: number;
    }>;
    redeemPoints(req: any, dto: RedeemPointsDto): Promise<{
        transaction: import("./loyalty-transaction.entity").LoyaltyTransaction;
        total_points: number;
    }>;
}
