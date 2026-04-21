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
exports.Dish = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const index_1 = require("../common/enums/index");
let Dish = class Dish {
    id;
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
    created_at;
    updated_at;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, nom: { required: true, type: () => String }, description: { required: true, type: () => String }, photo_url: { required: true, type: () => String }, categorie: { required: true, enum: require("../common/enums/index").DishCategory }, prix: { required: true, type: () => Number }, sans_sel: { required: true, type: () => Boolean }, sans_gras: { required: true, type: () => Boolean }, sans_sucre: { required: true, type: () => Boolean }, sans_huile: { required: true, type: () => Boolean }, vegetarien: { required: true, type: () => Boolean }, halal: { required: true, type: () => Boolean }, allergenes: { required: true, type: () => [String] }, is_active: { required: true, type: () => Boolean }, created_at: { required: true, type: () => Date }, updated_at: { required: true, type: () => Date } };
    }
};
exports.Dish = Dish;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Dish.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Dish.prototype, "nom", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Dish.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Dish.prototype, "photo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: index_1.DishCategory, nullable: true }),
    __metadata("design:type", String)
], Dish.prototype, "categorie", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Dish.prototype, "prix", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dish.prototype, "sans_sel", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dish.prototype, "sans_gras", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dish.prototype, "sans_sucre", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dish.prototype, "sans_huile", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dish.prototype, "vegetarien", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], Dish.prototype, "halal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'simple-array', nullable: true }),
    __metadata("design:type", Array)
], Dish.prototype, "allergenes", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], Dish.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Dish.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", Date)
], Dish.prototype, "updated_at", void 0);
exports.Dish = Dish = __decorate([
    (0, typeorm_1.Entity)('dishes')
], Dish);
//# sourceMappingURL=dish.entity.js.map