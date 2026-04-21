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
exports.PublishMenuDto = exports.UpdateMenuDto = exports.CreateMenuDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreateMenuDto {
    date;
    creneau;
    image_url;
    organisation_id;
    plats_ids;
    is_published;
    static _OPENAPI_METADATA_FACTORY() {
        return { date: { required: true, type: () => String }, creneau: { required: true, enum: require("../../common/enums/index").MealSlot }, image_url: { required: false, type: () => String }, organisation_id: { required: true, type: () => String, format: "uuid" }, plats_ids: { required: false, type: () => [String], format: "uuid" }, is_published: { required: false, type: () => Boolean } };
    }
}
exports.CreateMenuDto = CreateMenuDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-04-14', description: 'Date du menu (YYYY-MM-DD)' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: index_1.MealSlot, example: index_1.MealSlot.NOON, description: 'Créneau: MORNING | NOON | EVENING' }),
    (0, class_validator_1.IsEnum)(index_1.MealSlot),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "creneau", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:9000/mms-cantine/menus/menu-1.jpg', description: 'URL de l\'image du menu' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-organisation', description: 'UUID de l\'organisation' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateMenuDto.prototype, "organisation_id", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['uuid-dish-1', 'uuid-dish-2'], description: 'Liste des UUIDs des plats' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], CreateMenuDto.prototype, "plats_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateMenuDto.prototype, "is_published", void 0);
class UpdateMenuDto {
    date;
    creneau;
    image_url;
    plats_ids;
    is_published;
    static _OPENAPI_METADATA_FACTORY() {
        return { date: { required: false, type: () => String }, creneau: { required: false, enum: require("../../common/enums/index").MealSlot }, image_url: { required: false, type: () => String }, plats_ids: { required: false, type: () => [String], format: "uuid" }, is_published: { required: false, type: () => Boolean } };
    }
}
exports.UpdateMenuDto = UpdateMenuDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2026-04-15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateMenuDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.MealSlot }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.MealSlot),
    __metadata("design:type", String)
], UpdateMenuDto.prototype, "creneau", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:9000/mms-cantine/menus/menu-1.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateMenuDto.prototype, "image_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['uuid-dish-1'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsUUID)('4', { each: true }),
    __metadata("design:type", Array)
], UpdateMenuDto.prototype, "plats_ids", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateMenuDto.prototype, "is_published", void 0);
class PublishMenuDto {
    is_published;
    static _OPENAPI_METADATA_FACTORY() {
        return { is_published: { required: true, type: () => Boolean } };
    }
}
exports.PublishMenuDto = PublishMenuDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: true }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], PublishMenuDto.prototype, "is_published", void 0);
//# sourceMappingURL=menus.dto.js.map