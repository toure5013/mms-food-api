"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoyaltyService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const loyalty_transaction_entity_1 = require("./loyalty-transaction.entity");
const user_entity_1 = require("../users/user.entity");
let LoyaltyService = class LoyaltyService {
    loyaltyRepo;
    userRepo;
    constructor(loyaltyRepo, userRepo) {
        this.loyaltyRepo = loyaltyRepo;
        this.userRepo = userRepo;
    }
    async getPoints(userId) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        return {
            user_id: userId,
            loyalty_points: user.loyalty_points,
            loyalty_expires_at: user.loyalty_expires_at,
        };
    }
    async getHistory(userId) {
        return this.loyaltyRepo.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }
    async addPoints(dto) {
        const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        const transaction = this.loyaltyRepo.create({
            user_id: dto.user_id,
            points: dto.points,
            type: dto.type || loyalty_transaction_entity_1.LoyaltyTransactionType.EARNED,
            description: dto.description || `+${dto.points} points de fidélité`,
            reference: dto.reference,
        });
        await this.loyaltyRepo.save(transaction);
        user.loyalty_points = (user.loyalty_points || 0) + dto.points;
        if (!user.loyalty_expires_at) {
            const expiresAt = new Date();
            expiresAt.setMonth(expiresAt.getMonth() + 12);
            user.loyalty_expires_at = expiresAt;
        }
        await this.userRepo.save(user);
        return {
            transaction,
            total_points: user.loyalty_points,
        };
    }
    async redeemPoints(userId, dto) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        if ((user.loyalty_points || 0) < dto.points) {
            throw new common_1.BadRequestException(`Points insuffisants. Solde: ${user.loyalty_points}, demandé: ${dto.points}`);
        }
        const transaction = this.loyaltyRepo.create({
            user_id: userId,
            points: -dto.points,
            type: loyalty_transaction_entity_1.LoyaltyTransactionType.REDEEMED,
            description: dto.description || `Utilisation de ${dto.points} points`,
        });
        await this.loyaltyRepo.save(transaction);
        user.loyalty_points -= dto.points;
        await this.userRepo.save(user);
        return {
            transaction,
            total_points: user.loyalty_points,
        };
    }
    async getLeaderboard(limit = 10) {
        return this.userRepo.find({
            select: ['id', 'prenom', 'nom', 'loyalty_points', 'avatar_url'],
            order: { loyalty_points: 'DESC' },
            take: limit,
        });
    }
};
exports.LoyaltyService = LoyaltyService;
exports.LoyaltyService = LoyaltyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(loyalty_transaction_entity_1.LoyaltyTransaction)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], LoyaltyService);
//# sourceMappingURL=loyalty.service.js.map