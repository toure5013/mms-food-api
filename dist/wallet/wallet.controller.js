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
exports.WalletController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const wallet_service_1 = require("./wallet.service");
const wallet_dto_1 = require("./dto/wallet.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
let WalletController = class WalletController {
    walletService;
    constructor(walletService) {
        this.walletService = walletService;
    }
    getWallet(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.walletService.getWallet(userId);
    }
    credit(req, dto) {
        const userId = req.user?.id || req.user?.sub;
        return this.walletService.credit(userId, dto);
    }
    debit(req, dto) {
        const userId = req.user?.id || req.user?.sub;
        return this.walletService.debit(userId, dto);
    }
    getTransactions(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.walletService.getTransactions(userId);
    }
};
exports.WalletController = WalletController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Consulter mon solde', description: 'Retourne le solde actuel du porte-monnaie de l\'utilisateur connecté.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Porte-monnaie trouvé.' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Non authentifié.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getWallet", null);
__decorate([
    (0, common_1.Post)('credit'),
    (0, swagger_1.ApiOperation)({ summary: 'Recharger le porte-monnaie', description: 'Initie une recharge via Mobile Money pour augmenter le solde.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Recharge initiée.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallet_dto_1.CreditWalletDto]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "credit", null);
__decorate([
    (0, common_1.Post)('debit'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_MMS),
    (0, swagger_1.ApiOperation)({ summary: 'Débiter le porte-monnaie', description: 'Effectue un débit manuel sur le solde d\'un utilisateur (usage administratif).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Débit effectué.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, wallet_dto_1.DebitWalletDto]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "debit", null);
__decorate([
    (0, common_1.Get)('transactions'),
    (0, swagger_1.ApiOperation)({ summary: 'Historique des transactions', description: 'Liste toutes les opérations de crédit et débit passées sur le porte-monnaie.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des transactions retournée.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], WalletController.prototype, "getTransactions", null);
exports.WalletController = WalletController = __decorate([
    (0, swagger_1.ApiTags)('Wallet'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('wallet'),
    __metadata("design:paramtypes", [wallet_service_1.WalletService])
], WalletController);
//# sourceMappingURL=wallet.controller.js.map