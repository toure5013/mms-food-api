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
const index_1 = require("../common/enums/index");
const uuid_1 = require("uuid");
let OrdersService = class OrdersService {
    orderRepo;
    dishRepo;
    constructor(orderRepo, dishRepo) {
        this.orderRepo = orderRepo;
        this.dishRepo = dishRepo;
    }
    findAll(organisationId, employeId, statut) {
        const where = {};
        if (organisationId)
            where.organisation_id = organisationId;
        if (employeId)
            where.employe_id = employeId;
        if (statut)
            where.statut = statut;
        return this.orderRepo.find({
            where,
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
        const plats = await this.dishRepo.find({
            where: { id: (0, typeorm_2.In)(plats_ids) },
        });
        if (plats.length === 0) {
            throw new common_1.BadRequestException('Aucun plat valide trouvé');
        }
        const montant_total = plats.reduce((sum, dish) => sum + Number(dish.prix), 0);
        const timestamp = Date.now().toString().slice(-6);
        const numero_commande = `MMS-${new Date().getFullYear()}-${timestamp}`;
        const qr_code_token = (0, uuid_1.v4)();
        const order = this.orderRepo.create({
            ...orderData,
            numero_commande,
            qr_code_token,
            montant_total,
            montant_employe: montant_total,
            plats,
            statut: index_1.OrderStatus.PENDING,
            points_gagnes: Math.floor(montant_total / 1000),
        });
        return this.orderRepo.save(order);
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
            throw new common_1.BadRequestException(`Transition invalide: ${order.statut} → ${dto.statut}. Transitions autorisées: ${allowed.join(', ')}`);
        }
        order.statut = dto.statut;
        if (dto.statut === index_1.OrderStatus.RETRIEVED) {
            order.date_recuperation = new Date();
        }
        return this.orderRepo.save(order);
    }
    async retrieveByQrCode(dto) {
        const order = await this.findByQrCode(dto.qr_code_token);
        if (order.statut !== index_1.OrderStatus.READY) {
            throw new common_1.BadRequestException(`La commande n'est pas prête pour le retrait (statut actuel: ${order.statut})`);
        }
        order.statut = index_1.OrderStatus.RETRIEVED;
        order.date_recuperation = new Date();
        if (dto.recupere_par) {
            order.recupere_par = dto.recupere_par;
        }
        return this.orderRepo.save(order);
    }
    async getStats(organisationId) {
        const qb = this.orderRepo.createQueryBuilder('order');
        qb.where('order.organisation_id = :organisationId', { organisationId });
        const total = await qb.getCount();
        const pending = await qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.PENDING }).getCount();
        const confirmed = await qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.CONFIRMED }).getCount();
        const retrieved = await qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.RETRIEVED }).getCount();
        const cancelled = await qb.clone().andWhere('order.statut = :s', { s: index_1.OrderStatus.CANCELLED }).getCount();
        return { total, pending, confirmed, retrieved, cancelled };
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(dish_entity_1.Dish)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], OrdersService);
//# sourceMappingURL=orders.service.js.map