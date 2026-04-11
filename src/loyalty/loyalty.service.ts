import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoyaltyTransaction, LoyaltyTransactionType } from './loyalty-transaction.entity';
import { User } from '../users/user.entity';
import { AddPointsDto, RedeemPointsDto } from './dto/loyalty.dto';

@Injectable()
export class LoyaltyService {
  constructor(
    @InjectRepository(LoyaltyTransaction)
    private readonly loyaltyRepo: Repository<LoyaltyTransaction>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getPoints(userId: string) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    return {
      user_id: userId,
      loyalty_points: user.loyalty_points,
      loyalty_expires_at: user.loyalty_expires_at,
    };
  }

  async getHistory(userId: string) {
    return this.loyaltyRepo.find({
      where: { user_id: userId },
      order: { created_at: 'DESC' },
    });
  }

  async addPoints(dto: AddPointsDto) {
    const user = await this.userRepo.findOne({ where: { id: dto.user_id } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    // Créer la transaction
    const transaction = this.loyaltyRepo.create({
      user_id: dto.user_id,
      points: dto.points,
      type: dto.type || LoyaltyTransactionType.EARNED,
      description: dto.description || `+${dto.points} points de fidélité`,
      reference: dto.reference,
    });
    await this.loyaltyRepo.save(transaction);

    // Mettre à jour les points de l'utilisateur
    user.loyalty_points = (user.loyalty_points || 0) + dto.points;

    // Définir expiration à 12 mois si pas déjà défini
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

  async redeemPoints(userId: string, dto: RedeemPointsDto) {
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    if ((user.loyalty_points || 0) < dto.points) {
      throw new BadRequestException(
        `Points insuffisants. Solde: ${user.loyalty_points}, demandé: ${dto.points}`,
      );
    }

    // Créer la transaction de débit
    const transaction = this.loyaltyRepo.create({
      user_id: userId,
      points: -dto.points,
      type: LoyaltyTransactionType.REDEEMED,
      description: dto.description || `Utilisation de ${dto.points} points`,
    });
    await this.loyaltyRepo.save(transaction);

    // Déduire les points
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
}
