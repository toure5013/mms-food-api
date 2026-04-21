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
exports.User = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const index_1 = require("../common/enums/index");
const organisation_entity_1 = require("../organisations/organisation.entity");
const wallet_entity_1 = require("../wallet/wallet.entity");
let User = class User {
    id;
    prenom;
    nom;
    email;
    password_hash;
    role;
    telephone;
    avatar_url;
    service;
    regimes;
    allergies;
    otp_code;
    otp_expires_at;
    loyalty_points;
    loyalty_expires_at;
    fcm_token;
    is_active;
    is_first_login;
    organisation;
    organisation_id;
    created_at;
    updated_at;
    wallet;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, prenom: { required: true, type: () => String }, nom: { required: true, type: () => String }, email: { required: true, type: () => String }, password_hash: { required: true, type: () => String }, role: { required: true, enum: require("../common/enums/index").UserRole }, telephone: { required: true, type: () => String }, avatar_url: { required: true, type: () => String }, service: { required: true, type: () => String }, regimes: { required: true, type: () => [String] }, allergies: { required: true, type: () => [String] }, otp_code: { required: true, type: () => String }, otp_expires_at: { required: true, type: () => Date }, loyalty_points: { required: true, type: () => Number }, loyalty_expires_at: { required: true, type: () => Date }, fcm_token: { required: true, type: () => String }, is_active: { required: true, type: () => Boolean }, is_first_login: { required: true, type: () => Boolean }, organisation: { required: true, type: () => require("../organisations/organisation.entity").Organisation }, organisation_id: { required: true, type: () => String }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date }, wallet: { required: true, type: () => require("../wallet/wallet.entity").Wallet } };
    }
};
exports.User = User;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "prenom", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], User.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "password_hash", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.UserRole }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "telephone", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "avatar_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "service", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "regimes", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], User.prototype, "allergies", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", String)
], User.prototype, "otp_code", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, select: false }),
    __metadata("design:type", Date)
], User.prototype, "otp_expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], User.prototype, "loyalty_points", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", Date)
], User.prototype, "loyalty_expires_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "fcm_token", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], User.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], User.prototype, "is_first_login", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organisation_entity_1.Organisation, (org) => org.users, { nullable: true, eager: false }),
    (0, typeorm_1.JoinColumn)({ name: 'organisation_id' }),
    __metadata("design:type", organisation_entity_1.Organisation)
], User.prototype, "organisation", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], User.prototype, "organisation_id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], User.prototype, "updated_at", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => wallet_entity_1.Wallet, (wallet) => wallet.user),
    __metadata("design:type", wallet_entity_1.Wallet)
], User.prototype, "wallet", void 0);
exports.User = User = __decorate([
    (0, typeorm_1.Entity)('users')
], User);
//# sourceMappingURL=user.entity.js.map