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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const index_1 = require("../common/enums/index");
const user_entity_1 = require("../users/user.entity");
const dish_entity_1 = require("../dishes/dish.entity");
const organisation_entity_1 = require("../organisations/organisation.entity");
let Order = class Order {
    id;
    numero_commande;
    qr_code_token;
    statut;
    creneau;
    date_livraison;
    montant_total;
    montant_subvention;
    montant_employe;
    methode_paiement;
    points_gagnes;
    date_recuperation;
    recupere_par;
    is_guest;
    guest_info;
    employe;
    employe_id;
    organisation;
    organisation_id;
    plats;
    created_at;
    updated_at;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, numero_commande: { required: true, type: () => String }, qr_code_token: { required: true, type: () => String }, statut: { required: true, enum: require("../common/enums/index").OrderStatus }, creneau: { required: true, enum: require("../common/enums/index").MealSlot }, date_livraison: { required: true, type: () => String }, montant_total: { required: true, type: () => Number }, montant_subvention: { required: true, type: () => Number }, montant_employe: { required: true, type: () => Number }, methode_paiement: { required: true, enum: require("../common/enums/index").PaymentMethod }, points_gagnes: { required: true, type: () => Number }, date_recuperation: { required: true, type: () => Date }, recupere_par: { required: true, type: () => String }, is_guest: { required: true, type: () => Boolean }, guest_info: { required: true, type: () => Object }, employe: { required: true, type: () => require("../users/user.entity").User }, employe_id: { required: true, type: () => String }, organisation: { required: true, type: () => require("../organisations/organisation.entity").Organisation }, organisation_id: { required: true, type: () => String }, plats: { required: true, type: () => [require("../dishes/dish.entity").Dish] }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date } };
    }
};
exports.Order = Order;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Order.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Order.prototype, "numero_commande", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Order.prototype, "qr_code_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.OrderStatus, default: index_1.OrderStatus.PENDING }),
    __metadata("design:type", String)
], Order.prototype, "statut", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.MealSlot }),
    __metadata("design:type", String)
], Order.prototype, "creneau", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", String)
], Order.prototype, "date_livraison", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "montant_total", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "montant_subvention", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "montant_employe", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.PaymentMethod, nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "methode_paiement", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Order.prototype, "points_gagnes", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], Order.prototype, "date_recuperation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "recupere_par", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Order.prototype, "is_guest", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb', nullable: true }),
    __metadata("design:type", Object)
], Order.prototype, "guest_info", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false, nullable: true }),
    (0, typeorm_1.JoinColumn)({ name: 'employe_id' }),
    __metadata("design:type", user_entity_1.User)
], Order.prototype, "employe", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "employe_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organisation_entity_1.Organisation, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'organisation_id' }),
    __metadata("design:type", organisation_entity_1.Organisation)
], Order.prototype, "organisation", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Order.prototype, "organisation_id", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => dish_entity_1.Dish, { eager: true }),
    (0, typeorm_1.JoinTable)({ name: 'order_dishes' }),
    __metadata("design:type", Array)
], Order.prototype, "plats", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Order.prototype, "updated_at", void 0);
exports.Order = Order = __decorate([
    (0, typeorm_1.Entity)('orders')
], Order);
//# sourceMappingURL=order.entity.js.map