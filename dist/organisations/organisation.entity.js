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
exports.Organisation = void 0;
const typeorm_1 = require("typeorm");
const index_1 = require("../common/enums/index");
const user_entity_1 = require("../users/user.entity");
let Organisation = class Organisation {
    id;
    slug;
    nom;
    logo_url;
    couleur_primaire;
    couleur_secondaire;
    mode_gestion_menu;
    subvention_type;
    subvention_valeur;
    subvention_plafond_mensuel;
    is_active;
    users;
    created_at;
    updated_at;
};
exports.Organisation = Organisation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Organisation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Organisation.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Organisation.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Organisation.prototype, "logo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#E87722' }),
    __metadata("design:type", String)
], Organisation.prototype, "couleur_primaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: '#1A1A2E' }),
    __metadata("design:type", String)
], Organisation.prototype, "couleur_secondaire", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.MenuMode, default: index_1.MenuMode.MMS }),
    __metadata("design:type", String)
], Organisation.prototype, "mode_gestion_menu", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.SubventionType, default: index_1.SubventionType.FIXED }),
    __metadata("design:type", String)
], Organisation.prototype, "subvention_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, default: 0 }),
    __metadata("design:type", Number)
], Organisation.prototype, "subvention_valeur", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2, nullable: true }),
    __metadata("design:type", Number)
], Organisation.prototype, "subvention_plafond_mensuel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Organisation.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.organisation),
    __metadata("design:type", Array)
], Organisation.prototype, "users", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Organisation.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Organisation.prototype, "updated_at", void 0);
exports.Organisation = Organisation = __decorate([
    (0, typeorm_1.Entity)('organisations')
], Organisation);
//# sourceMappingURL=organisation.entity.js.map