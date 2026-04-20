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
exports.UpdateDishDto = exports.CreateDishDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreateDishDto {
    nom;
    description;
    photo_url;
    categorie;
    prix;
    sans_sel;
    sans_gras;
    sans_sucre;
    sans_huile;
    vegetarien;
    halal;
    allergenes;
}
exports.CreateDishDto = CreateDishDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Poulet Yassa' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateDishDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Délicieux poulet mariné au citron et oignons' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDishDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:9000/mms-cantine/dishes/poulet-yassa.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateDishDto.prototype, "photo_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.DishCategory, example: index_1.DishCategory.RESISTANCE }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.DishCategory),
    __metadata("design:type", String)
], CreateDishDto.prototype, "categorie", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 3500 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateDishDto.prototype, "prix", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDishDto.prototype, "sans_sel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDishDto.prototype, "sans_gras", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDishDto.prototype, "sans_sucre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDishDto.prototype, "sans_huile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDishDto.prototype, "vegetarien", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateDishDto.prototype, "halal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Arachide'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateDishDto.prototype, "allergenes", void 0);
class UpdateDishDto {
    nom;
    description;
    photo_url;
    categorie;
    prix;
    sans_sel;
    sans_gras;
    sans_sucre;
    sans_huile;
    vegetarien;
    halal;
    allergenes;
    is_active;
}
exports.UpdateDishDto = UpdateDishDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Poulet Yassa' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDishDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Délicieux poulet mariné au citron et oignons' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDishDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:9000/mms-cantine/dishes/poulet-yassa.jpg' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateDishDto.prototype, "photo_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.DishCategory }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.DishCategory),
    __metadata("design:type", String)
], UpdateDishDto.prototype, "categorie", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 3500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateDishDto.prototype, "prix", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "sans_sel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "sans_gras", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "sans_sucre", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "sans_huile", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "vegetarien", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "halal", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: ['Arachide'] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], UpdateDishDto.prototype, "allergenes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateDishDto.prototype, "is_active", void 0);
//# sourceMappingURL=dishes.dto.js.map