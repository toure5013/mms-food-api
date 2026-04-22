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
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const index_1 = require("../../common/enums/index");
class CreateOrganisationDto {
    nom;
    slug;
    logo_url;
    couleur_primaire;
    couleur_secondaire;
    mode_gestion_menu;
    subvention_type;
    subvention_valeur;
    subvention_plafond_mensuel;
    prix_min_plats;
    prix_max_plats;
    prix_max_menu;
    composition_menu;
    financial_mode;
    is_active;
    is_guest_order_enabled;
    guest_config;
    guest_order_start_time;
    guest_order_end_time;
    static _OPENAPI_METADATA_FACTORY() {
        return { nom: { required: true, type: () => String }, slug: { required: true, type: () => String }, logo_url: { required: false, type: () => String }, couleur_primaire: { required: false, type: () => String, pattern: "^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$" }, couleur_secondaire: { required: false, type: () => String, pattern: "^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$" }, mode_gestion_menu: { required: false, enum: require("../../common/enums/index").MenuMode }, subvention_type: { required: false, enum: require("../../common/enums/index").SubventionType }, subvention_valeur: { required: false, type: () => Number, minimum: 0 }, subvention_plafond_mensuel: { required: false, type: () => Number, minimum: 0 }, prix_min_plats: { required: false, type: () => Number, minimum: 0 }, prix_max_plats: { required: false, type: () => Number, minimum: 0 }, prix_max_menu: { required: false, type: () => Number, minimum: 0 }, composition_menu: { required: false, enum: require("../../common/enums/index").DishCategory, isArray: true }, financial_mode: { required: false, enum: require("../../common/enums/index").FinancialMode }, is_active: { required: false, type: () => Boolean }, is_guest_order_enabled: { required: false, type: () => Boolean }, guest_config: { required: false, type: () => Object }, guest_order_start_time: { required: false, type: () => String }, guest_order_end_time: { required: false, type: () => String } };
    }
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
    (0, swagger_1.ApiPropertyOptional)({ example: '#1A1A2E' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "couleur_secondaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.MenuMode, example: index_1.MenuMode.AUTONOME }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.MenuMode),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "mode_gestion_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.SubventionType, example: index_1.SubventionType.FIXED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.SubventionType),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "subvention_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrganisationDto.prototype, "subvention_valeur", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrganisationDto.prototype, "subvention_plafond_mensuel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrganisationDto.prototype, "prix_min_plats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrganisationDto.prototype, "prix_max_plats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateOrganisationDto.prototype, "prix_max_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [index_1.DishCategory.RESISTANCE] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(index_1.DishCategory, { each: true }),
    __metadata("design:type", Array)
], CreateOrganisationDto.prototype, "composition_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.FinancialMode, example: index_1.FinancialMode.DEBT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.FinancialMode),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "financial_mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateOrganisationDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateOrganisationDto.prototype, "is_guest_order_enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { fields: [] } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], CreateOrganisationDto.prototype, "guest_config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "08:00" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "guest_order_start_time", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "11:30" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganisationDto.prototype, "guest_order_end_time", void 0);
class UpdateOrganisationDto {
    nom;
    slug;
    logo_url;
    couleur_primaire;
    couleur_secondaire;
    mode_gestion_menu;
    subvention_type;
    subvention_valeur;
    subvention_plafond_mensuel;
    prix_min_plats;
    prix_max_plats;
    prix_max_menu;
    composition_menu;
    financial_mode;
    is_active;
    is_guest_order_enabled;
    guest_config;
    guest_order_start_time;
    guest_order_end_time;
    static _OPENAPI_METADATA_FACTORY() {
        return { nom: { required: false, type: () => String }, slug: { required: false, type: () => String }, logo_url: { required: false, type: () => String }, couleur_primaire: { required: false, type: () => String, pattern: "^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$" }, couleur_secondaire: { required: false, type: () => String, pattern: "^#?([0-9A-F]{3}|[0-9A-F]{4}|[0-9A-F]{6}|[0-9A-F]{8})$" }, mode_gestion_menu: { required: false, enum: require("../../common/enums/index").MenuMode }, subvention_type: { required: false, enum: require("../../common/enums/index").SubventionType }, subvention_valeur: { required: false, type: () => Number, minimum: 0 }, subvention_plafond_mensuel: { required: false, type: () => Number, minimum: 0 }, prix_min_plats: { required: false, type: () => Number, minimum: 0 }, prix_max_plats: { required: false, type: () => Number, minimum: 0 }, prix_max_menu: { required: false, type: () => Number, minimum: 0 }, composition_menu: { required: false, enum: require("../../common/enums/index").DishCategory, isArray: true }, financial_mode: { required: false, enum: require("../../common/enums/index").FinancialMode }, is_active: { required: false, type: () => Boolean }, is_guest_order_enabled: { required: false, type: () => Boolean }, guest_config: { required: false, type: () => Object }, guest_order_start_time: { required: false, type: () => String }, guest_order_end_time: { required: false, type: () => String } };
    }
}
exports.UpdateOrganisationDto = UpdateOrganisationDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'BMCE Bank' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "nom", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'bmce-bank' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "slug", void 0);
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
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#1A1A2E' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsHexColor)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "couleur_secondaire", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.MenuMode, example: index_1.MenuMode.AUTONOME }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.MenuMode),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "mode_gestion_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.SubventionType, example: index_1.SubventionType.FIXED }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.SubventionType),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "subvention_type", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateOrganisationDto.prototype, "subvention_valeur", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateOrganisationDto.prototype, "subvention_plafond_mensuel", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 500 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateOrganisationDto.prototype, "prix_min_plats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 5000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateOrganisationDto.prototype, "prix_max_plats", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 6000 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateOrganisationDto.prototype, "prix_max_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: [index_1.DishCategory.RESISTANCE] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsEnum)(index_1.DishCategory, { each: true }),
    __metadata("design:type", Array)
], UpdateOrganisationDto.prototype, "composition_menu", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: index_1.FinancialMode, example: index_1.FinancialMode.DEBT }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(index_1.FinancialMode),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "financial_mode", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: true }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrganisationDto.prototype, "is_active", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], UpdateOrganisationDto.prototype, "is_guest_order_enabled", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: { fields: [] } }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], UpdateOrganisationDto.prototype, "guest_config", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "08:00" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "guest_order_start_time", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: "11:30" }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganisationDto.prototype, "guest_order_end_time", void 0);
//# sourceMappingURL=organisations.dto.js.map