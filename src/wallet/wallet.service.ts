import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
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
    private readonly dataSource: DataSource,
  ) {}

  async getOrCreateWallet(userId: string): Promise<Wallet> {
    let wallet = await this.walletRepo.findOne({ where: { user_id: userId } });
    if (!wallet) {
      wallet = this.walletRepo.create({ user_id: userId, solde: 0, is_active: true });
      wallet = await this.walletRepo.save(wallet);
    }
    return wallet;
  }

  async getWallet(userId: string) {
    return this.getOrCreateWallet(userId);
  }

  async credit(userId: string, dto: CreditWalletDto) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, {
        where: { user_id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      const current = wallet ?? manager.create(Wallet, { user_id: userId, solde: 0, is_active: true });
      const newSolde = Number(current.solde) + dto.montant;
      current.solde = newSolde;
      const savedWallet = await manager.save(Wallet, current);

      const transaction = manager.create(WalletTransaction, {
        type: TransactionType.CREDIT,
        montant: dto.montant,
        solde_apres: newSolde,
        description: `Rechargement via ${dto.methode_paiement}`,
        wallet_id: savedWallet.id,
      });
      const savedTx = await manager.save(WalletTransaction, transaction);

      return { wallet: savedWallet, transaction: savedTx };
    });
  }

  async debit(userId: string, dto: DebitWalletDto) {
    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, {
        where: { user_id: userId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!wallet) throw new BadRequestException('Portefeuille introuvable');

      if (Number(wallet.solde) < dto.montant) {
        throw new BadRequestException(
          `Solde insuffisant. Solde: ${wallet.solde} FCFA, demandé: ${dto.montant} FCFA`,
        );
      }

      const newSolde = Number(wallet.solde) - dto.montant;
      wallet.solde = newSolde;
      const savedWallet = await manager.save(Wallet, wallet);

      const transaction = manager.create(WalletTransaction, {
        type: TransactionType.DEBIT,
        montant: dto.montant,
        solde_apres: newSolde,
        description: dto.description || 'Paiement commande',
        reference: dto.reference,
        wallet_id: savedWallet.id,
      });
      const savedTx = await manager.save(WalletTransaction, transaction);

      return { wallet: savedWallet, transaction: savedTx };
    });
  }

  async getTransactions(userId: string) {
    const wallet = await this.getOrCreateWallet(userId);
    return this.transactionRepo.find({
      where: { wallet_id: wallet.id },
      order: { created_at: 'DESC' },
    });
  }
}
