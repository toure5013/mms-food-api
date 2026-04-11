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
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const notification_entity_1 = require("./notification.entity");
const user_entity_1 = require("../users/user.entity");
let NotificationsService = class NotificationsService {
    notificationRepo;
    userRepo;
    constructor(notificationRepo, userRepo) {
        this.notificationRepo = notificationRepo;
        this.userRepo = userRepo;
    }
    findAllByUser(userId) {
        return this.notificationRepo.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }
    async findUnreadCount(userId) {
        const count = await this.notificationRepo.count({
            where: { user_id: userId, is_read: false },
        });
        return { unread_count: count };
    }
    async findOne(id) {
        const notif = await this.notificationRepo.findOne({ where: { id } });
        if (!notif)
            throw new common_1.NotFoundException('Notification introuvable');
        return notif;
    }
    async create(dto) {
        const notification = this.notificationRepo.create(dto);
        return this.notificationRepo.save(notification);
    }
    async markAsRead(id, isRead) {
        const notif = await this.findOne(id);
        notif.is_read = isRead;
        notif.read_at = isRead ? new Date() : null;
        return this.notificationRepo.save(notif);
    }
    async markAllAsRead(userId) {
        await this.notificationRepo.update({ user_id: userId, is_read: false }, { is_read: true, read_at: new Date() });
        return { message: 'Toutes les notifications ont été marquées comme lues' };
    }
    async registerFcmToken(userId, fcmToken) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        user.fcm_token = fcmToken;
        await this.userRepo.save(user);
        return { message: 'Token FCM enregistré' };
    }
    async remove(id) {
        const notif = await this.findOne(id);
        return this.notificationRepo.remove(notif);
    }
};
exports.NotificationsService = NotificationsService;
exports.NotificationsService = NotificationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], NotificationsService);
//# sourceMappingURL=notifications.service.js.map