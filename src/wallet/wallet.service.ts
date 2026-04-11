import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction, TransactionType } from './wallet-transaction.entity';
import { CreditWalletDto, DebitWalletDto } from './dto/wallet.dto';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepo: Repository<Wallet>,
    @InjectRepository(WalletTransaction)
    private readonly transactionRepo: Repository<WalletTransaction>,
  ) {}

  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { user_id: userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({
        user_id: userId,
        solde: 0,
        is_active: true,
      });
      wallet = await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async getWallet(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return wallet;
  }

  async credit(userId: string, dto: CreditWalletDto) {
    const wallet = await this.getOrCreateWallet(userId);

    const newSolde = Number(wallet.solde) + dto.montant;
    wallet.solde = newSolde;
    await this.walletRepo.save(wallet);

    // Enregistrer la transaction
    const transaction = this.transactionRepo.create({
      type: TransactionType.CREDIT,
      montant: dto.montant,
      solde_apres: newSolde,
      description: `Rechargement via ${dto.methode_paiement}`,
      wallet_id: wallet.id,
    });
    await this.transactionRepo.save(transaction);

    return { wallet, transaction };
  }

  async debit(userId: string, dto: DebitWalletDto) {
    const wallet = await this.getOrCreateWallet(userId);

    if (Number(wallet.solde) < dto.montant) {
      throw new BadRequestException(
        `Solde insuffisant. Solde actuel: ${wallet.solde} FCFA, montant demandé: ${dto.montant} FCFA`,
      );
    }

    const newSolde = Number(wallet.solde) - dto.montant;
    wallet.solde = newSolde;
    await this.walletRepo.save(wallet);

    const transaction = this.transactionRepo.create({
      type: TransactionType.DEBIT,
      montant: dto.montant,
      solde_apres: newSolde,
      description: dto.description || 'Paiement commande',
      reference: dto.reference,
      wallet_id: wallet.id,
    });
    await this.transactionRepo.save(transaction);

    return { wallet, transaction };
  }

  async getTransactions(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return this.transactionRepo.find({
      where: { wallet_id: wallet.id },
      order: { created_at: 'DESC' },
    });
  }
}
