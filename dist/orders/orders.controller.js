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
exports.OrdersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const orders_service_1 = require("./orders.service");
const orders_dto_1 = require("./dto/orders.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const public_decorator_1 = require("../common/decorators/public.decorator");
const index_1 = require("../common/enums/index");
let OrdersController = class OrdersController {
    ordersService;
    constructor(ordersService) {
        this.ordersService = ordersService;
    }
    findAll(organisationId, employeId, statut) {
        return this.ordersService.findAll(organisationId, employeId, statut);
    }
    getStats(organisationId) {
        return this.ordersService.getStats(organisationId);
    }
    findOne(id) {
        return this.ordersService.findOne(id);
    }
    create(dto) {
        return this.ordersService.create(dto);
    }
    createGuest(dto) {
        return this.ordersService.createGuestOrder(dto);
    }
    updateStatus(id, dto) {
        return this.ordersService.updateStatus(id, dto);
    }
    retrieveByQrCode(dto) {
        return this.ordersService.retrieveByQrCode(dto);
    }
};
exports.OrdersController = OrdersController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des commandes', description: 'Retourne la liste des commandes, filtrable par organisation, employé et statut.' }),
    (0, swagger_1.ApiQuery)({ name: 'organisation_id', required: false, description: 'UUID de l\'organisation' }),
    (0, swagger_1.ApiQuery)({ name: 'employe_id', required: false, description: 'UUID de l\'employé' }),
    (0, swagger_1.ApiQuery)({ name: 'statut', required: false, description: 'Filtrer par statut (PENDING, CONFIRMED, PAID, etc.)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des commandes retournée.' }),
    __param(0, (0, common_1.Query)('organisation_id')),
    __param(1, (0, common_1.Query)('employe_id')),
    __param(2, (0, common_1.Query)('statut')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('stats/:organisationId'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Statistiques des commandes', description: 'Retourne les statistiques de commandes pour une organisation donnée (Total, Aujourd\'hui, etc.).' }),
    (0, swagger_1.ApiParam)({ name: 'organisationId', description: 'UUID de l\'organisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statistiques retournées.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé.' }),
    __param(0, (0, common_1.Param)('organisationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'une commande', description: 'Retourne les détails complets d\'une commande par son UUID.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la commande' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commande trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Commande non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.EMPLOYEE, index_1.UserRole.ADMIN_CLIENT, index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une commande', description: 'Crée une nouvelle commande, génère un numéro unique et un token de QR code.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Commande créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides ou solde insuffisant.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orders_dto_1.CreateOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('guest'),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une commande invité', description: 'Permet à un invité de commander sans compte.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Commande créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides ou créneau fermé.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orders_dto_1.CreateGuestOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "createGuest", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_MMS, index_1.UserRole.COOK),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour le statut', description: 'Modifie le statut d\'une commande (ex: passer de READY à RETRIEVED).' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la commande' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut mis à jour.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Commande non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, orders_dto_1.UpdateOrderStatusDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('retrieve'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_MMS),
    (0, swagger_1.ApiOperation)({ summary: 'Retrait par scan QR code', description: 'Marque une commande comme récupérée en utilisant le token du QR code.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Commande marquée comme récupérée.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Token QR code invalide ou commande déjà récupérée/annulée.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [orders_dto_1.RetrieveOrderDto]),
    __metadata("design:returntype", void 0)
], OrdersController.prototype, "retrieveByQrCode", null);
exports.OrdersController = OrdersController = __decorate([
    (0, swagger_1.ApiTags)('Orders'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('orders'),
    __metadata("design:paramtypes", [orders_service_1.OrdersService])
], OrdersController);
//# sourceMappingURL=orders.controller.js.map