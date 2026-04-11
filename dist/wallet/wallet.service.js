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
exports.WalletService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const wallet_entity_1 = require("./wallet.entity");
const wallet_transaction_entity_1 = require("./wallet-transaction.entity");
let WalletService = class WalletService {
    walletRepo;
    transactionRepo;
    constructor(walletRepo, transactionRepo) {
        this.walletRepo = walletRepo;
        this.transactionRepo = transactionRepo;
    }
    async getOrCreateWallet(userId) {
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
    async getWallet(userId) {
        const wallet = await this.getOrCreateWallet(userId);
        return wallet;
    }
    async credit(userId, dto) {
        const wallet = await this.getOrCreateWallet(userId);
        const newSolde = Number(wallet.solde) + dto.montant;
        wallet.solde = newSolde;
        await this.walletRepo.save(wallet);
        const transaction = this.transactionRepo.create({
            type: wallet_transaction_entity_1.TransactionType.CREDIT,
            montant: dto.montant,
            solde_apres: newSolde,
            description: `Rechargement via ${dto.methode_paiement}`,
            wallet_id: wallet.id,
        });
        await this.transactionRepo.save(transaction);
        return { wallet, transaction };
    }
    async debit(userId, dto) {
        const wallet = await this.getOrCreateWallet(userId);
        if (Number(wallet.solde) < dto.montant) {
            throw new common_1.BadRequestException(`Solde insuffisant. Solde actuel: ${wallet.solde} FCFA, montant demandé: ${dto.montant} FCFA`);
        }
        const newSolde = Number(wallet.solde) - dto.montant;
        wallet.solde = newSolde;
        await this.walletRepo.save(wallet);
        const transaction = this.transactionRepo.create({
            type: wallet_transaction_entity_1.TransactionType.DEBIT,
            montant: dto.montant,
            solde_apres: newSolde,
            description: dto.description || 'Paiement commande',
            reference: dto.reference,
            wallet_id: wallet.id,
        });
        await this.transactionRepo.save(transaction);
        return { wallet, transaction };
    }
    async getTransactions(userId) {
        const wallet = await this.getOrCreateWallet(userId);
        return this.transactionRepo.find({
            where: { wallet_id: wallet.id },
            order: { created_at: 'DESC' },
        });
    }
};
exports.WalletService = WalletService;
exports.WalletService = WalletService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(wallet_entity_1.Wallet)),
    __param(1, (0, typeorm_1.InjectRepository)(wallet_transaction_entity_1.WalletTransaction)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], WalletService);
//# sourceMappingURL=wallet.service.js.map