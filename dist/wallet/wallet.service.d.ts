import { Repository } from 'typeorm';
import { Wallet } from './wallet.entity';
import { WalletTransaction } from './wallet-transaction.entity';
import { CreditWalletDto, DebitWalletDto } from './dto/wallet.dto';
export declare class WalletService {
    private readonly walletRepo;
    private readonly transactionRepo;
    constructor(walletRepo: Repository<Wallet>, transactionRepo: Repository<WalletTransaction>);
    getOrCreateWallet(userId: string): Promise<Wallet>;
    getWallet(userId: string): Promise<Wallet>;
    credit(userId: string, dto: CreditWalletDto): Promise<{
        wallet: Wallet;
        transaction: WalletTransaction;
    }>;
    debit(userId: string, dto: DebitWalletDto): Promise<{
        wallet: Wallet;
        transaction: WalletTransaction;
    }>;
    getTransactions(userId: string): Promise<WalletTransaction[]>;
}
