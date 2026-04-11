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
exports.UpdateOrganisationDto = exports.CreateOrganisationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreateOrganisationDto {
    nom;
    slug;
    logo_url;
    couleur_primaire;
    mode_menu;
    type_subvention;
}
exports.CreateOrganisationDto = CreateOrganisationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'BMCE Bank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'bmce-bank' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:9000/mms-cantine/logos/bmce.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "logo_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#E87722' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "couleur_primaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.MenuMode, example: index_1.MenuMode.AUTONOME }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.MenuMode),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "mode_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.SubventionType, example: index_1.SubventionType.FIXED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.SubventionType),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "type_subvention", void 0);
class UpdateOrganisationDto {
    nom;
    logo_url;
    couleur_primaire;
}
exports.UpdateOrganisationDto = UpdateOrganisationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BMCE Bank' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'http://localhost:9000/mms-cantine/logos/bmce.png' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "logo_url", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#E87722' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "couleur_primaire", void 0);
//# sourceMappingURL=organisations.dto.js.map