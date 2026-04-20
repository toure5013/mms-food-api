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
exports.LoyaltyController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const loyalty_service_1 = require("./loyalty.service");
const loyalty_dto_1 = require("./dto/loyalty.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
let LoyaltyController = class LoyaltyController {
    loyaltyService;
    constructor(loyaltyService) {
        this.loyaltyService = loyaltyService;
    }
    getPoints(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.loyaltyService.getPoints(userId);
    }
    getHistory(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.loyaltyService.getHistory(userId);
    }
    getLeaderboard(limit) {
        return this.loyaltyService.getLeaderboard(limit ? Number(limit) : 10);
    }
    addPoints(dto) {
        return this.loyaltyService.addPoints(dto);
    }
    redeemPoints(req, dto) {
        const userId = req.user?.id || req.user?.sub;
        return this.loyaltyService.redeemPoints(userId, dto);
    }
};
exports.LoyaltyController = LoyaltyController;
__decorate([
    (0, common_1.Get)('points'),
    (0, swagger_1.ApiOperation)({ summary: 'Mes points', description: 'Retourne le solde actuel de points de fidélité de l\'utilisateur.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Solde de points retourné.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getPoints", null);
__decorate([
    (0, common_1.Get)('history'),
    (0, swagger_1.ApiOperation)({ summary: 'Historique des points', description: 'Affiche toutes les transactions de gains et dépenses de points de fidélité.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Historique retourné.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getHistory", null);
__decorate([
    (0, common_1.Get)('leaderboard'),
    (0, swagger_1.ApiOperation)({ summary: 'Classement', description: 'Retourne le top des utilisateurs ayant le plus de points de fidélité.' }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, description: 'Nb max de résultats (défaut: 10)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Classement retourné.' }),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "getLeaderboard", null);
__decorate([
    (0, common_1.Post)('add'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_MMS),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter des points (Admin)', description: 'Crédite manuellement des points à un utilisateur (récompense exceptionnelle, etc.).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Points ajoutés.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Interdit.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [loyalty_dto_1.AddPointsDto]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "addPoints", null);
__decorate([
    (0, common_1.Post)('redeem'),
    (0, swagger_1.ApiOperation)({ summary: 'Utiliser mes points', description: 'Convertit des points de fidélité en avantages ou bons (selon règles business).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Points utilisés avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Points insuffisants ou offre invalide.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, loyalty_dto_1.RedeemPointsDto]),
    __metadata("design:returntype", void 0)
], LoyaltyController.prototype, "redeemPoints", null);
exports.LoyaltyController = LoyaltyController = __decorate([
    (0, swagger_1.ApiTags)('Loyalty'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('loyalty'),
    __metadata("design:paramtypes", [loyalty_service_1.LoyaltyService])
], LoyaltyController);
//# sourceMappingURL=loyalty.controller.js.map