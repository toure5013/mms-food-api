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
exports.PaymentsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const payments_service_1 = require("./payments.service");
const payments_dto_1 = require("./dto/payments.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const index_1 = require("../common/enums/index");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    findAll(orderId, userId) {
        return this.paymentsService.findAll(orderId, userId);
    }
    findOne(id) {
        return this.paymentsService.findOne(id);
    }
    create(dto) {
        return this.paymentsService.create(dto);
    }
    handleWebhook(dto) {
        return this.paymentsService.handleWebhook(dto);
    }
    refund(id) {
        return this.paymentsService.refund(id);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des paiements', description: 'Retourne l\'historique des paiements, filtrable par commande ou utilisateur.' }),
    (0, swagger_1.ApiQuery)({ name: 'order_id', required: false, description: 'UUID de la commande' }),
    (0, swagger_1.ApiQuery)({ name: 'user_id', required: false, description: 'UUID de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des paiements retournée.' }),
    __param(0, (0, common_1.Query)('order_id')),
    __param(1, (0, common_1.Query)('user_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'un paiement', description: 'Retourne les informations d\'une transaction spécifique.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du paiement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Paiement trouvé.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paiement non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.EMPLOYEE, index_1.UserRole.ADMIN_CLIENT, index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Initier un paiement', description: 'Crée une transaction de paiement pour une commande (Wave, Orange Money, etc.).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Paiement initié.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payments_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('webhook'),
    (0, public_decorator_1.Public)(),
    (0, swagger_1.ApiOperation)({ summary: 'Callback Webhook', description: 'Réception des notifications de succès/échec de la part du provider de paiement.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Webhook traité.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [payments_dto_1.WebhookPaymentDto]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "handleWebhook", null);
__decorate([
    (0, common_1.Patch)(':id/refund'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Rembourser un paiement', description: 'Initie une procédure de remboursement pour une transaction donnée.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du paiement' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Remboursement traité.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Paiement non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PaymentsController.prototype, "refund", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Payments'),
    (0, common_1.Controller)('payments'),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map