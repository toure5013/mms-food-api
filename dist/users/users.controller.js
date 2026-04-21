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
exports.UsersController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const users_service_1 = require("./users.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
const users_dto_1 = require("./dto/users.dto");
let UsersController = class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    findAll(orgId, req) {
        const user = req?.user;
        if (user && user.role === index_1.UserRole.ADMIN_CLIENT) {
            return this.usersService.findAll(user.organisation_id);
        }
        return this.usersService.findAll(orgId);
    }
    create(dto) {
        return this.usersService.create(dto);
    }
    findOne(id) {
        return this.usersService.findOne(id);
    }
    update(id, dto) {
        return this.usersService.update(id, dto);
    }
    remove(id) {
        return this.usersService.remove(id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Liste des utilisateurs', description: 'Retourne la liste des utilisateurs. Un Admin Client ne voit que les employés de son organisation.' }),
    (0, swagger_1.ApiQuery)({ name: 'organisation_id', required: false, description: 'Filtrer par organisation (UUID)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste retournée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé — rôle insuffisant.' }),
    __param(0, (0, common_1.Query)('organisation_id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Créer / inviter un utilisateur', description: 'Crée un nouvel utilisateur et envoie un OTP par email pour la première connexion.' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Utilisateur créé avec succès — OTP envoyé par email.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Un utilisateur avec cet email existe déjà.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [users_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'un utilisateur', description: 'Retourne les informations complètes d\'un utilisateur par son UUID.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de l\'utilisateur' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Utilisateur trouvé.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Utilisateur non trouvé.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN, index_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de l\'utilisateur' }),
    openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer un utilisateur' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de l\'utilisateur' }),
    openapi.ApiResponse({ status: 200, type: require("./user.entity").User }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "remove", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('Users'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map