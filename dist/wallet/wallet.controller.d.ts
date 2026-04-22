import { WalletService } from './wallet.service';
import { CreditWalletDto, DebitWalletDto } from './dto/wallet.dto';
export declare class WalletController {
    private readonly walletService;
    constructor(walletService: WalletService);
    getWallet(req: any): Promise<import("./wallet.entity").Wallet>;
    credit(req: any, dto: CreditWalletDto, targetUserId?: string): Promise<{
        wallet: import("./wallet.entity").Wallet;
        transaction: import("./wallet-transaction.entity").WalletTransaction;
    }>;
    debit(req: any, dto: DebitWalletDto): Promise<{
        wallet: import("./wallet.entity").Wallet;
        transaction: import("./wallet-transaction.entity").WalletTransaction;
    }>;
    getTransactions(req: any): Promise<import("./wallet-transaction.entity").WalletTransaction[]>;
}
