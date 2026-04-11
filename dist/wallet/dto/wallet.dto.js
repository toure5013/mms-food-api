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
exports.DebitWalletDto = exports.CreditWalletDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreditWalletDto {
    montant;
    methode_paiement;
    telephone;
}
exports.CreditWalletDto = CreditWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000, description: 'Montant à créditer en FCFA' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(100),
    __metadata("design:type", Number)
], CreditWalletDto.prototype, "montant", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.PaymentMethod, example: index_1.PaymentMethod.ORANGE_MONEY }),
    (0, class_validator_1.IsEnum)(index_1.PaymentMethod),
    __metadata("design:type", String)
], CreditWalletDto.prototype, "methode_paiement", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '+225 0102030405' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreditWalletDto.prototype, "telephone", void 0);
class DebitWalletDto {
    montant;
    description;
    reference;
}
exports.DebitWalletDto = DebitWalletDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500, description: 'Montant à débiter en FCFA' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], DebitWalletDto.prototype, "montant", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Paiement commande MMS-2026-001' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitWalletDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-order' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], DebitWalletDto.prototype, "reference", void 0);
//# sourceMappingURL=wallet.dto.js.map