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
exports.LoyaltyTransaction = exports.LoyaltyTransactionType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../users/user.entity");
var LoyaltyTransactionType;
(function (LoyaltyTransactionType) {
    LoyaltyTransactionType["EARNED"] = "EARNED";
    LoyaltyTransactionType["REDEEMED"] = "REDEEMED";
    LoyaltyTransactionType["EXPIRED"] = "EXPIRED";
    LoyaltyTransactionType["BONUS"] = "BONUS";
})(LoyaltyTransactionType || (exports.LoyaltyTransactionType = LoyaltyTransactionType = {}));
let LoyaltyTransaction = class LoyaltyTransaction {
    id;
    type;
    points;
    description;
    reference;
    user;
    user_id;
    created_at;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, type: { required: true, enum: require("./loyalty-transaction.entity").LoyaltyTransactionType }, points: { required: true, type: () => Number }, description: { required: true, type: () => String }, reference: { required: true, type: () => String }, user: { required: true, type: () => require("../users/user.entity").User }, user_id: { required: true, type: () => String }, created_at: { required: true, type: () => Date } };
    }
};
exports.LoyaltyTransaction = LoyaltyTransaction;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: LoyaltyTransactionType }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], LoyaltyTransaction.prototype, "points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "reference", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, { eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], LoyaltyTransaction.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], LoyaltyTransaction.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], LoyaltyTransaction.prototype, "created_at", void 0);
exports.LoyaltyTransaction = LoyaltyTransaction = __decorate([
    (0, typeorm_1.Entity)('loyalty_transactions')
], LoyaltyTransaction);
//# sourceMappingURL=loyalty-transaction.entity.js.map