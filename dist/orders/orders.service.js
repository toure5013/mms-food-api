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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./order.entity");
const dish_entity_1 = require("../dishes/dish.entity");
const organisation_entity_1 = require("../organisations/organisation.entity");
const user_entity_1 = require("../users/user.entity");
const notification_entity_1 = require("../notifications/notification.entity");
const index_1 = require("../common/enums/index");
const wallet_service_1 = require("../wallet/wallet.service");
const push_service_1 = require("../common/push/push.service");
const uuid_1 = require("uuid");
let OrdersService = class OrdersService {
    orderRepo;
    dishRepo;
    organisationRepo;
    userRepo;
    notificationRepo;
    walletService;
    pushService;
    constructor(orderRepo, dishRepo, organisationRepo, userRepo, notificationRepo, walletService, pushService) {
        this.orderRepo = orderRepo;
        this.dishRepo = dishRepo;
        this.organisationRepo = organisationRepo;
        this.userRepo = userRepo;
        this.notificationRepo = notificationRepo;
        this.walletService = walletService;
        this.pushService = pushService;
    }
    findAll(organisationId, employeId, statut) {
        const where = {};
        if (organisationId)
            where.organisation_id = organisationId;
        if (employeId)
            where.employe_id = employeId;
        if (statut)
            where.statut = statut.toUpperCase();
        return this.orderRepo.find({
            where,
            relations: ['plats', 'employe', 'organisation'],
            order: { created_at: 'DESC' },
        });
    }
    async findMyOrders(employeId) {
        return this.orderRepo.find({
            where: { employe_id: employeId },
            relations: ['plats', 'employe', 'organisation'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['plats', 'employe', 'organisation'],
        });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable');
        return order;
    }
    async findByQrCode(qrCodeToken) {
        const order = await this.orderRepo.findOne({
            where: { qr_code_token: qrCodeToken },
            relations: ['plats', 'employe', 'organisation'],
        });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable pour ce QR code');
        return order;
    }
    async create(dto) {
        const { plats_ids, ...orderData } = dto;
        const plats = await this.dishRepo.find({ where: { id: (0, typeorm_2.In)(plats_ids) } });
        if (plats.length === 0)
            throw new common_1.BadRequestException('Aucun plat valide trouvé');
        const org = await this.organisationRepo.findOneBy({ id: dto.organisation_id });
        if (!org)
            throw new common_1.NotFoundException('Organisation introuvable');
        if (!org.is_active)
            throw new common_1.BadRequestException('Organisation inactive');
        const montant_total = plats.reduce((sum, d) => sum + Number(d.prix), 0);
        const montant_subvention = this.calculateSubvention(montant_total, org);
        const montant_employe = Math.max(0, montant_total - montant_subvention);
        const timestamp = Date.now().toString().slice(-6);
        const numero_commande = `MMS-${new Date().getFullYear()}-${timestamp}`;
        const qr_code_token = (0, uuid_1.v4)();
        if (dto.methode_paiement === index_1.PaymentMethod.WALLET && dto.employe_id && montant_employe > 0) {
            await this.walletService.debit(dto.employe_id, {
                montant: montant_employe,
                description: `Paiement commande ${numero_commande}`,
                reference: numero_commande,
            });
        }
        const initialStatut = dto.methode_paiement === index_1.PaymentMethod.WALLET ||
            dto.methode_paiement === index_1.PaymentMethod.EMPLOYER
            ? index_1.OrderStatus.CONFIRMED
            : index_1.OrderStatus.PENDING;
        const order = this.orderRepo.create({
            ...orderData,
            numero_commande,
            qr_code_token,
            montant_total,
            montant_subvention,
            montant_employe,
            plats,
            statut: initialStatut,
            points_gagnes: Math.floor(montant_total / 1000),
        });
        const saved = await this.orderRepo.save(order);
        if (dto.employe_id) {
            await this.notifyUser(dto.employe_id, {
                titre: 'Commande confirmée',
                message: `Votre commande ${numero_commande} a été enregistrée.`,
                pushTitle: 'Commande confirmée ✅',
                pushBody: `${numero_commande} — ${plats.map((p) => p.nom).join(', ')}`,
                data: { order_id: saved.id, numero_commande },
            });
        }
        return saved;
    }
    async updateStatus(id, dto) {
        const order = await this.findOne(id);
        const validTransitions = {
            [index_1.OrderStatus.PENDING]: [index_1.OrderStatus.CONFIRMED, index_1.OrderStatus.CANCELLED],
            [index_1.OrderStatus.CONFIRMED]: [index_1.OrderStatus.PAID, index_1.OrderStatus.CANCELLED],
            [index_1.OrderStatus.PAID]: [index_1.OrderStatus.PREPARING, index_1.OrderStatus.CANCELLED],
            [index_1.OrderStatus.PREPARING]: [index_1.OrderStatus.READY],
            [index_1.OrderStatus.READY]: [index_1.OrderStatus.RETRIEVED],
        };
        const allowed = validTransitions[order.statut] || [];
        if (!allowed.includes(dto.statut)) {
            throw new common_1.BadRequestException(`Transition invalide: ${order.statut} → ${dto.statut}. Autorisées: ${allowed.join(', ')}`);
        }
        order.statut = dto.statut;
        if (dto.statut === index_1.OrderStatus.RETRIEVED) {
            order.date_recuperation = new Date();
        }
        const saved = await this.orderRepo.save(order);
        if (dto.statut === index_1.OrderStatus.READY && order.employe_id) {
            await this.notifyUser(order.employe_id, {
                titre: 'Commande prête 🍽️',
                message: `Votre commande ${order.numero_commande} est prête à être récupérée.`,
                pushTitle: 'Commande prête ! 🍽️',
                pushBody: `${order.numero_commande} — venez récupérer votre repas.`,
                data: { order_id: order.id, numero_commande: order.numero_commande },
            });
        }
        if (dto.statut === index_1.OrderStatus.CANCELLED && order.employe_id) {
            await this.notifyUser(order.employe_id, {
                titre: 'Commande annulée',
                message: `Votre commande ${order.numero_commande} a été annulée.`,
                pushTitle: 'Commande annulée ❌',
                pushBody: `${order.numero_commande} a été annulée.`,
                data: { order_id: order.id, numero_commande: order.numero_commande },
            });
        }
        return saved;
    }
    async cancel(id, userId) {
        const order = await this.findOne(id);
        const cancellable = [index_1.OrderStatus.PENDING, index_1.OrderStatus.CONFIRMED];
        if (!cancellable.includes(order.statut)) {
            throw new common_1.BadRequestException(`Impossible d'annuler une commande au statut ${order.statut}`);
        }
        if (order.employe_id && order.employe_id !== userId) {
            throw new common_1.BadRequestException("Vous ne pouvez annuler que vos propres commandes");
        }
        order.statut = index_1.OrderStatus.CANCELLED;
        const saved = await this.orderRepo.save(order);
        if (order.employe_id) {
            await this.notifyUser(order.employe_id, {
                titre: 'Commande annulée',
                message: `Votre commande ${order.numero_commande} a été annulée.`,
                pushTitle: 'Commande annulée',
                pushBody: `${order.numero_commande} a été annulée.`,
                data: { order_id: order.id },
            });
        }
        return saved;
    }
    async retrieveByQrCode(dto) {
        const order = await this.findByQrCode(dto.qr_code_token);
        if (order.statut !== index_1.OrderStatus.READY) {
            throw new common_1.BadRequestException(`La commande n'est pas prête (statut: ${order.statut})`);
        }
        order.statut = index_1.OrderStatus.RETRIEVED;
        order.date_recuperation = new Date();
        if (dto.recupere_par)
            order.recupere_par = dto.recupere_par;
        return this.orderRepo.save(order);
    }
    async getStats(organisationId) {
        const qb = this.orderRepo.createQueryBuilder('order');
        qb.where('order.organisation_id = :organisationId', { organisationId });
        const [total, pending, confirmed, retrieved, cancelled] = await Promise.all([
            qb.getCount(),
            qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.PENDING }).getCount(),
            qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.CONFIRMED }).getCount(),
            qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.RETRIEVED }).getCount(),
            qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.CANCELLED }).getCount(),
        ]);
        return { total, pending, confirmed, retrieved, cancelled };
    }
    async createGuestOrder(dto) {
        const org = await this.organisationRepo.findOneBy({ id: dto.organisation_id });
        if (!org)
            throw new common_1.NotFoundException('Organisation introuvable');
        if (!org.is_guest_order_enabled) {
            throw new common_1.BadRequestException('Les commandes invités sont désactivées pour cette organisation');
        }
        const now = new Date();
        const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        if (org.guest_order_start_time && currentTime < org.guest_order_start_time) {
            throw new common_1.BadRequestException(`Commandes pas encore ouvertes (Ouverture: ${org.guest_order_start_time})`);
        }
        if (org.guest_order_end_time && currentTime > org.guest_order_end_time) {
            throw new common_1.BadRequestException(`Commandes fermées (Fermeture: ${org.guest_order_end_time})`);
        }
        const { plats_ids, ...orderData } = dto;
        const plats = await this.dishRepo.find({ where: { id: (0, typeorm_2.In)(plats_ids) } });
        if (plats.length === 0)
            throw new common_1.BadRequestException('Aucun plat valide trouvé');
        const montant_total = plats.reduce((sum, d) => sum + Number(d.prix), 0);
        const timestamp = Date.now().toString().slice(-6);
        const order = this.orderRepo.create({
            ...orderData,
            numero_commande: `GUEST-${new Date().getFullYear()}-${timestamp}`,
            qr_code_token: (0, uuid_1.v4)(),
            montant_total,
            montant_subvention: 0,
            montant_employe: montant_total,
            plats,
            statut: index_1.OrderStatus.PENDING,
            is_guest: true,
            points_gagnes: 0,
        });
        return this.orderRepo.save(order);
    }
    async notifyUser(userId, opts) {
        try {
            await this.notificationRepo.save(this.notificationRepo.create({
                titre: opts.titre,
                message: opts.message,
                user_id: userId,
                canal: index_1.NotificationChannel.PUSH,
            }));
        }
        catch { }
        try {
            const user = await this.userRepo.findOne({ where: { id: userId }, select: ['fcm_token'] });
            if (user?.fcm_token) {
                await this.pushService.sendToToken(user.fcm_token, opts.pushTitle, opts.pushBody, opts.data);
            }
        }
        catch { }
    }
    calculateSubvention(montant_total, org) {
        const valeur = Number(org.subvention_valeur);
        const plafond = org.subvention_plafond_mensuel ? Number(org.subvention_plafond_mensuel) : Infinity;
        switch (org.subvention_type) {
            case index_1.SubventionType.FIXED:
                return Math.min(valeur, montant_total);
            case index_1.SubventionType.PERCENTAGE:
                return Math.min((montant_total * valeur) / 100, montant_total);
            case index_1.SubventionType.CAPPED:
                return Math.min((montant_total * valeur) / 100, plafond, montant_total);
            case index_1.SubventionType.HYBRID:
                return Math.min(valeur + (montant_total * 0.1), plafond, montant_total);
            case index_1.SubventionType.FULL:
                return montant_total;
            default:
                return 0;
        }
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(dish_entity_1.Dish)),
    __param(2, (0, typeorm_1.InjectRepository)(organisation_entity_1.Organisation)),
    __param(3, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(4, (0, typeorm_1.InjectRepository)(notification_entity_1.Notification)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        wallet_service_1.WalletService,
        push_service_1.PushService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map