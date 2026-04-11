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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./payment.entity");
const order_entity_1 = require("../orders/order.entity");
const index_1 = require("../common/enums/index");
const uuid_1 = require("uuid");
let PaymentsService = class PaymentsService {
    paymentRepo;
    orderRepo;
    constructor(paymentRepo, orderRepo) {
        this.paymentRepo = paymentRepo;
        this.orderRepo = orderRepo;
    }
    findAll(orderId, userId) {
        const where = {};
        if (orderId)
            where.order_id = orderId;
        if (userId)
            where.user_id = userId;
        return this.paymentRepo.find({
            where,
            relations: ['order', 'user'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const payment = await this.paymentRepo.findOne({
            where: { id },
            relations: ['order', 'user'],
        });
        if (!payment)
            throw new common_1.NotFoundException('Paiement introuvable');
        return payment;
    }
    async create(dto) {
        const order = await this.orderRepo.findOne({ where: { id: dto.order_id } });
        if (!order)
            throw new common_1.NotFoundException('Commande introuvable');
        if (order.statut !== index_1.OrderStatus.CONFIRMED && order.statut !== index_1.OrderStatus.PENDING) {
            throw new common_1.BadRequestException(`La commande n'est pas en attente de paiement (statut: ${order.statut})`);
        }
        const reference = `PAY-MMS-${Date.now().toString(36).toUpperCase()}-${(0, uuid_1.v4)().slice(0, 4).toUpperCase()}`;
        const payment = this.paymentRepo.create({
            ...dto,
            reference,
            statut: index_1.PaymentStatus.PENDING,
        });
        return this.paymentRepo.save(payment);
    }
    async handleWebhook(dto) {
        const payment = await this.paymentRepo.findOne({
            where: { reference: dto.reference },
            relations: ['order'],
        });
        if (!payment)
            throw new common_1.NotFoundException('Paiement introuvable pour cette référence');
        payment.provider_transaction_id = dto.transaction_id;
        payment.provider_response = JSON.stringify(dto);
        if (dto.status === 'SUCCESS') {
            payment.statut = index_1.PaymentStatus.SUCCESS;
            if (payment.order) {
                payment.order.statut = index_1.OrderStatus.PAID;
                await this.orderRepo.save(payment.order);
            }
        }
        else {
            payment.statut = index_1.PaymentStatus.FAILED;
            payment.error_message = `Paiement échoué via ${dto.provider || 'inconnu'}`;
        }
        return this.paymentRepo.save(payment);
    }
    async refund(id) {
        const payment = await this.findOne(id);
        if (payment.statut !== index_1.PaymentStatus.SUCCESS) {
            throw new common_1.BadRequestException('Seuls les paiements réussis peuvent être remboursés');
        }
        payment.statut = index_1.PaymentStatus.REFUNDED;
        return this.paymentRepo.save(payment);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map