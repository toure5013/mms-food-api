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
exports.MenusController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const menus_service_1 = require("./menus.service");
const menus_dto_1 = require("./dto/menus.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
let MenusController = class MenusController {
    menusService;
    constructor(menusService) {
        this.menusService = menusService;
    }
    findDaily(date, req) {
        const organisationId = req.user?.organisation_id;
        return this.menusService.findDailyDishes(date, organisationId);
    }
    findAll(organisationId, date) {
        return this.menusService.findAll(organisationId, date);
    }
    findOne(id) {
        return this.menusService.findOne(id);
    }
    create(dto) {
        return this.menusService.create(dto);
    }
    update(id, dto) {
        return this.menusService.update(id, dto);
    }
    publish(id, dto) {
        return this.menusService.publish(id, dto.is_published);
    }
    remove(id) {
        return this.menusService.remove(id);
    }
};
exports.MenusController = MenusController;
__decorate([
    (0, common_1.Get)('daily'),
    (0, swagger_1.ApiOperation)({ summary: 'Plats du jour', description: 'Retourne la liste complète des plats disponibles pour une date donnée (filtré par organisation).' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: true, description: 'Date au format YYYY-MM-DD' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des plats retournée.' }),
    __param(0, (0, common_1.Query)('date')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findDaily", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des menus', description: 'Retourne la liste des menus planifiés, filtrable par organisation et/ou par date.' }),
    (0, swagger_1.ApiQuery)({ name: 'organisation_id', required: false, description: 'Filtrer par organisation (UUID)' }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'Filtrer par date (format YYYY-MM-DD)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des menus retournée.' }),
    __param(0, (0, common_1.Query)('organisation_id')),
    __param(1, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'un menu', description: 'Retourne un menu avec la liste de ses plats associés.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu trouvé avec ses plats.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Créer un menu', description: 'Crée un nouveau menu pour une date et un créneau donné, et associe les plats sélectionnés.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Menu créé avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides (date passée, créneau invalide, etc.).' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Un menu existe déjà pour cette date/créneau/organisation.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [menus_dto_1.CreateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un menu', description: 'Remplace entièrement la configuration d\'un menu existant.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu mis à jour.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, menus_dto_1.UpdateMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Publier / dépublier un menu', description: 'Change la visibilité d\'un menu. Un menu publié est visible par les employés pour passer commande.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Statut de publication mis à jour.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, menus_dto_1.PublishMenuDto]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "publish", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un menu', description: 'Supprime définitivement un menu et ses associations aux plats.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID du menu' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Menu supprimé.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Menu non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MenusController.prototype, "remove", null);
exports.MenusController = MenusController = __decorate([
    (0, swagger_1.ApiTags)('Menus'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('menus'),
    __metadata("design:paramtypes", [menus_service_1.MenusService])
], MenusController);
//# sourceMappingURL=menus.controller.js.map