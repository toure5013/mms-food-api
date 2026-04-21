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
exports.OrganisationsController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const organisations_service_1 = require("./organisations.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const index_1 = require("../common/enums/index");
const organisations_dto_1 = require("./dto/organisations.dto");
let OrganisationsController = class OrganisationsController {
    organisationsService;
    constructor(organisationsService) {
        this.organisationsService = organisationsService;
    }
    findAll() {
        return this.organisationsService.findAll();
    }
    create(dto) {
        return this.organisationsService.create(dto);
    }
    findOne(id, req) {
        const user = req.user;
        if (user.role !== index_1.UserRole.SUPER_ADMIN && user.role !== index_1.UserRole.ADMIN_MMS) {
            if (user.organisation_id !== id) {
                throw new common_1.ForbiddenException('Accès refusé à cette organisation');
            }
        }
        return this.organisationsService.findOne(id);
    }
    update(id, dto) {
        return this.organisationsService.update(id, dto);
    }
    remove(id) {
        return this.organisationsService.remove(id);
    }
};
exports.OrganisationsController = OrganisationsController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Liste toutes les organisations', description: 'Retourne la liste complète des entreprises clientes. Réservé au Super Admin.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Liste des organisations retournée.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé — rôle SUPER_ADMIN requis.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OrganisationsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Créer une organisation', description: 'Enregistre une nouvelle entreprise cliente avec sa configuration (subventions, composition menu, branding).' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Organisation créée avec succès.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Données invalides.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Une organisation avec ce slug existe déjà.' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organisations_dto_1.CreateOrganisationDto]),
    __metadata("design:returntype", void 0)
], OrganisationsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Détails d\'une organisation', description: 'Retourne les informations complètes d\'une organisation. Un utilisateur non-admin ne peut voir que sa propre organisation.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de l\'organisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organisation trouvée.' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Accès refusé à cette organisation.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organisation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], OrganisationsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Mettre à jour une organisation', description: 'Modifie partiellement la configuration d\'une organisation (nom, branding, subventions, etc.).' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de l\'organisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organisation mise à jour.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organisation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organisations_dto_1.UpdateOrganisationDto]),
    __metadata("design:returntype", void 0)
], OrganisationsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(index_1.UserRole.SUPER_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Supprimer une organisation', description: 'Supprime définitivement une organisation et toutes ses données associées.' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'UUID de l\'organisation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Organisation supprimée.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Organisation non trouvée.' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OrganisationsController.prototype, "remove", null);
exports.OrganisationsController = OrganisationsController = __decorate([
    (0, swagger_1.ApiTags)('Organisations'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('organisations'),
    __metadata("design:paramtypes", [organisations_service_1.OrganisationsService])
], OrganisationsController);
//# sourceMappingURL=organisations.controller.js.map