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
exports.NotificationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const notifications_service_1 = require("./notifications.service");
const notifications_dto_1 = require("./dto/notifications.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
let NotificationsController = class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    findAll(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.notificationsService.findAllByUser(userId);
    }
    getUnreadCount(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.notificationsService.findUnreadCount(userId);
    }
    findOne(id) {
        return this.notificationsService.findOne(id);
    }
    create(dto) {
        return this.notificationsService.create(dto);
    }
    markAsRead(id, dto) {
        return this.notificationsService.markAsRead(id, dto.is_read);
    }
    markAllAsRead(req) {
        const userId = req.user?.id || req.user?.sub;
        return this.notificationsService.markAllAsRead(userId);
    }
    registerFcmToken(req, dto) {
        const userId = req.user?.id || req.user?.sub;
        return this.notificationsService.registerFcmToken(userId, dto.fcm_token);
    }
    remove(id) {
        return this.notificationsService.remove(id);
    }
};
exports.NotificationsController = NotificationsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Mes notifications', description: 'Liste toutes les notifications reçues par l\'utilisateur connecté.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des notifications retournée.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('unread-count'),
    (0, swagger_1.ApiOperation)({ summary: 'Compteur de non lues', description: 'Retourne le nombre total de notifications non encore consultées.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Compteur retourné.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "getUnreadCount", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails notification', description: 'Retourne le contenu détaillé d\'une notification spécifique.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Notification non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_MMS),
    (0, swagger_1.ApiOperation)({ summary: 'Envoyer une notification', description: 'Envoie manuellement une notification à un utilisateur (admin uniquement).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Notification envoyée.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [notifications_dto_1.CreateNotificationDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/read'),
    (0, swagger_1.ApiOperation)({ summary: 'Changer statut lecture', description: 'Marque une notification comme lue ou non lue.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut mis à jour.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, notifications_dto_1.MarkReadDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAsRead", null);
__decorate([
    (0, common_1.Patch)('read-all'),
    (0, swagger_1.ApiOperation)({ summary: 'Tout marquer comme lu', description: 'Marque instantanément toutes les notifications de l\'utilisateur comme lues.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Toutes les notifications marquées comme lues.' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "markAllAsRead", null);
__decorate([
    (0, common_1.Post)('fcm-token'),
    (0, swagger_1.ApiOperation)({ summary: 'Enregistrer token FCM', description: 'Associe un token Firebase Cloud Messaging à l\'utilisateur pour les notifications Push.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Token enregistré.' }),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, notifications_dto_1.RegisterFcmTokenDto]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "registerFcmToken", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une notification', description: 'Supprime définitivement une notification de l\'historique.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de la notification' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Notification supprimée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], NotificationsController.prototype, "remove", null);
exports.NotificationsController = NotificationsController = __decorate([
    (0, swagger_1.ApiTags)('Notifications'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('notifications'),
    __metadata("design:paramtypes", [notifications_service_1.NotificationsService])
], NotificationsController);
//# sourceMappingURL=notifications.controller.js.map