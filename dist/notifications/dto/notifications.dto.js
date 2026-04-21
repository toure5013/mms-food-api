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
exports.RegisterFcmTokenDto = exports.MarkReadDto = exports.CreateNotificationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreateNotificationDto {
    titre;
    message;
    user_id;
    canal;
    action_url;
    metadata;
    static _OPENAPI_METADATA_FACTORY() {
        return { titre: { required: true, type: () => String }, message: { required: true, type: () => String }, user_id: { required: true, type: () => String, format: "uuid" }, canal: { required: false, enum: require("../../common/enums/index").NotificationChannel }, action_url: { required: false, type: () => String }, metadata: { required: false, type: () => String } };
    }
}
exports.CreateNotificationDto = CreateNotificationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Commande prête !', description: 'Titre de la notification' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "titre", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Votre commande MMS-2026-001 est prête au retrait.' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-user', description: 'UUID du destinataire' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "user_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.NotificationChannel, example: index_1.NotificationChannel.PUSH }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.NotificationChannel),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "canal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '/orders/uuid-order' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "action_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '{"order_id": "uuid"}' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNotificationDto.prototype, "metadata", void 0);
class MarkReadDto {
    is_read;
    static _OPENAPI_METADATA_FACTORY() {
        return { is_read: { required: true, type: () => Boolean } };
    }
}
exports.MarkReadDto = MarkReadDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], MarkReadDto.prototype, "is_read", void 0);
class RegisterFcmTokenDto {
    fcm_token;
    static _OPENAPI_METADATA_FACTORY() {
        return { fcm_token: { required: true, type: () => String } };
    }
}
exports.RegisterFcmTokenDto = RegisterFcmTokenDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'firebase_cloud_messaging_token_here' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], RegisterFcmTokenDto.prototype, "fcm_token", void 0);
//# sourceMappingURL=notifications.dto.js.map