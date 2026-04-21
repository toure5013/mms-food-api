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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DishesController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dishes_service_1 = require("./dishes.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
const dishes_dto_1 = require("./dto/dishes.dto");
let DishesController = class DishesController {
    dishesService;
    constructor(dishesService) {
        this.dishesService = dishesService;
    }
    findAll() {
        return this.dishesService.findAll();
    }
    create(dto) {
        return this.dishesService.create(dto);
    }
    findOne(id) {
        return this.dishesService.findOne(id);
    }
};
exports.DishesController = DishesController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Catalogue des plats', description: 'Retourne la liste complète des plats disponibles, avec leurs informations nutritionnelles et allergènes.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des plats retournée.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Ajouter un plat', description: 'Crée un nouveau plat dans le catalogue avec ses caractéristiques (catégorie, prix, allergènes, régimes alimentaires).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Plat créé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dishes_dto_1.CreateDishDto]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'un plat', description: 'Retourne les informations complètes d\'un plat (description, prix, photo, allergènes, flags nutritionnels).' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du plat' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Plat trouvé.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Plat non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DishesController.prototype, "findOne", null);
exports.DishesController = DishesController = __decorate([
    (0, swagger_1.ApiTags)('Dishes'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('dishes'),
    __metadata("design:paramtypes", [dishes_service_1.DishesService])
], DishesController);
//# sourceMappingURL=dishes.controller.js.map