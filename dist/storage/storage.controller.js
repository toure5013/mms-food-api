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
exports.StorageController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const swagger_1 = require("@nestjs/swagger");
const storage_service_1 = require("./storage.service");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const enums_1 = require("../common/enums");
let StorageController = class StorageController {
    storageService;
    constructor(storageService) {
        this.storageService = storageService;
    }
    async uploadFile(file, folder) {
        if (!file) {
            throw new common_1.BadRequestException('Aucun fichier fourni');
        }
        const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validMimeTypes.includes(file.mimetype)) {
            throw new common_1.BadRequestException('Format de fichier non supporté. Utilisez JPG, PNG ou WEBP.');
        }
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            throw new common_1.BadRequestException('Le fichier est trop volumineux (max 5 MB).');
        }
        const url = await this.storageService.uploadFile(file, folder || 'uploads');
        return {
            message: 'Fichier uploadé avec succès',
            url,
        };
    }
};
exports.StorageController = StorageController;
__decorate([
    (0, common_1.Post)('upload'),
    (0, roles_decorator_1.Roles)(enums_1.UserRole.SUPER_ADMIN, enums_1.UserRole.ADMIN_MMS, enums_1.UserRole.ADMIN_CLIENT),
    (0, swagger_1.ApiOperation)({ summary: 'Uploader un fichier', description: 'Enregistre une image ou un document sur le stockage MinIO (S3).' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'Le fichier à uploader (JPG, PNG, WEBP — Max 5 Mo)',
                },
                folder: {
                    type: 'string',
                    example: 'dishes',
                    description: 'dossier de destination (ex: dishes, avatars, logos)',
                },
            },
        },
    }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Fichier uploadé avec succès — Retourne l\'URL publique.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Fichier manquant, trop gros ou format invalide.' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('folder')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], StorageController.prototype, "uploadFile", null);
exports.StorageController = StorageController = __decorate([
    (0, swagger_1.ApiTags)('Storage'),
    (0, swagger_1.ApiBearerAuth)('JWT-auth'),
    (0, common_1.Controller)('storage'),
    __metadata("design:paramtypes", [storage_service_1.StorageService])
], StorageController);
//# sourceMappingURL=storage.controller.js.map