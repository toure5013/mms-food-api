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
exports.WebhookPaymentDto = exports.CreatePaymentDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreatePaymentDto {
    order_id;
    user_id;
    methode;
    montant;
    telephone;
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-order', description: 'UUID de la commande à payer' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "order_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'UUID de l\'utilisateur payeur' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.PaymentMethod, example: index_1.PaymentMethod.WAVE }),
    (0, class_validator_1.IsEnum)(index_1.PaymentMethod),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "methode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500, description: 'Montant en FCFA' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "montant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+225 0102030405', description: 'Numéro Mobile Money' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "telephone", void 0);
class WebhookPaymentDto {
    transaction_id;
    reference;
    status;
    provider;
    amount;
}
exports.WebhookPaymentDto = WebhookPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'TXN-123456', description: 'ID de transaction du provider' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WebhookPaymentDto.prototype, "transaction_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'REF-MMS-001', description: 'Référence interne MMS' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WebhookPaymentDto.prototype, "reference", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: ['SUCCESS', 'FAILED'], example: 'SUCCESS' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], WebhookPaymentDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'WAVE' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], WebhookPaymentDto.prototype, "provider", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], WebhookPaymentDto.prototype, "amount", void 0);
//# sourceMappingURL=payments.dto.js.map