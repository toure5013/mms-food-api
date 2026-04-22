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
exports.RetrieveOrderDto = exports.UpdateOrderStatusDto = exports.CreateGuestOrderDto = exports.CreateOrderDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreateOrderDto {
    employe_id;
    organisation_id;
    creneau;
    date_livraison;
    plats_ids;
    methode_paiement;
    static _OPENAPI_METADATA_FACTORY() {
        return { employe_id: { required: false, type: () => String, format: "uuid" }, organisation_id: { required: true, type: () => String, format: "uuid" }, creneau: { required: true, enum: require("../../common/enums/index").MealSlot }, date_livraison: { required: true, type: () => String }, plats_ids: { required: true, type: () => [String], format: "uuid" }, methode_paiement: { required: false, enum: require("../../common/enums/index").PaymentMethod } };
    }
}
exports.CreateOrderDto = CreateOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-employe', description: 'UUID de l\'employé commandant' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "employe_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-organisation', description: 'UUID de l\'organisation' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "organisation_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.MealSlot, example: index_1.MealSlot.NOON }),
    (0, class_validator_1.IsEnum)(index_1.MealSlot),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "creneau", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-14', description: 'Date de livraison (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "date_livraison", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['uuid-dish-1', 'uuid-dish-2'], description: 'UUIDs des plats commandés' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateOrderDto.prototype, "plats_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.PaymentMethod, example: index_1.PaymentMethod.WAVE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.PaymentMethod),
    __metadata("design:type", String)
], CreateOrderDto.prototype, "methode_paiement", void 0);
class CreateGuestOrderDto {
    organisation_id;
    creneau;
    date_livraison;
    plats_ids;
    guest_info;
    static _OPENAPI_METADATA_FACTORY() {
        return { organisation_id: { required: true, type: () => String, format: "uuid" }, creneau: { required: true, enum: require("../../common/enums/index").MealSlot }, date_livraison: { required: true, type: () => String }, plats_ids: { required: true, type: () => [String], format: "uuid" }, guest_info: { required: true, type: () => Object } };
    }
}
exports.CreateGuestOrderDto = CreateGuestOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-organisation' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGuestOrderDto.prototype, "organisation_id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.MealSlot, example: index_1.MealSlot.NOON }),
    (0, class_validator_1.IsEnum)(index_1.MealSlot),
    __metadata("design:type", String)
], CreateGuestOrderDto.prototype, "creneau", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-14' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateGuestOrderDto.prototype, "date_livraison", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: ['uuid-dish-1'] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateGuestOrderDto.prototype, "plats_ids", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: { nom: 'Jean', chambre: '102' } }),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Object)
], CreateGuestOrderDto.prototype, "guest_info", void 0);
class UpdateOrderStatusDto {
    statut;
    static _OPENAPI_METADATA_FACTORY() {
        return { statut: { required: true, enum: require("../../common/enums/index").OrderStatus } };
    }
}
exports.UpdateOrderStatusDto = UpdateOrderStatusDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.OrderStatus, example: index_1.OrderStatus.CONFIRMED, description: 'Nouveau statut de la commande' }),
    (0, class_validator_1.IsEnum)(index_1.OrderStatus),
    __metadata("design:type", String)
], UpdateOrderStatusDto.prototype, "statut", void 0);
class RetrieveOrderDto {
    qr_code_token;
    recupere_par;
    static _OPENAPI_METADATA_FACTORY() {
        return { qr_code_token: { required: true, type: () => String }, recupere_par: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.RetrieveOrderDto = RetrieveOrderDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'qr-code-token-string', description: 'Token QR code scanné' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RetrieveOrderDto.prototype, "qr_code_token", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-distributeur', description: 'UUID du distributeur' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RetrieveOrderDto.prototype, "recupere_par", void 0);
//# sourceMappingURL=orders.dto.js.map