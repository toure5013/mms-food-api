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
exports.RedeemPointsDto = exports.AddPointsDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const loyalty_transaction_entity_1 = require("../loyalty-transaction.entity");
class AddPointsDto {
    user_id;
    points;
    type;
    description;
    reference;
}
exports.AddPointsDto = AddPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'UUID de l\'utilisateur' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], AddPointsDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10, description: 'Nombre de points' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], AddPointsDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: loyalty_transaction_entity_1.LoyaltyTransactionType, example: loyalty_transaction_entity_1.LoyaltyTransactionType.EARNED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(loyalty_transaction_entity_1.LoyaltyTransactionType),
    __metadata("design:type", String)
], AddPointsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Points commande MMS-2026-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPointsDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-order' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AddPointsDto.prototype, "reference", void 0);
class RedeemPointsDto {
    points;
    description;
}
exports.RedeemPointsDto = RedeemPointsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 50, description: 'Nombre de points à utiliser' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], RedeemPointsDto.prototype, "points", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Réduction sur commande' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RedeemPointsDto.prototype, "description", void 0);
//# sourceMappingURL=loyalty.dto.js.map