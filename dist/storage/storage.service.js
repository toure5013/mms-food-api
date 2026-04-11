"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var StorageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const Minio = __importStar(require("minio"));
const uuid_1 = require("uuid");
const path = __importStar(require("node:path"));
let StorageService = StorageService_1 = class StorageService {
    configService;
    minioClient;
    bucketName;
    logger = new common_1.Logger(StorageService_1.name);
    constructor(configService) {
        this.configService = configService;
        const endPoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
        const port = this.configService.get('MINIO_PORT', 9000);
        const accessKey = this.configService.get('MINIO_ACCESS_KEY', 'minioadmin');
        const secretKey = this.configService.get('MINIO_SECRET_KEY', 'minioadmin');
        this.bucketName = this.configService.get('MINIO_BUCKET_NAME', 'mms-cantine');
        this.minioClient = new Minio.Client({
            endPoint,
            port: Number(port),
            useSSL: false,
            accessKey,
            secretKey,
        });
    }
    async uploadFile(file, folder = 'uploads') {
        try {
            const extension = path.extname(file.originalname);
            const filename = `${folder}/${(0, uuid_1.v4)()}${extension}`;
            const metaData = {
                'Content-Type': file.mimetype,
            };
            await this.minioClient.putObject(this.bucketName, filename, file.buffer, file.size, metaData);
            const endPoint = this.configService.get('MINIO_ENDPOINT', 'localhost');
            const port = this.configService.get('MINIO_PORT', 9000);
            const isDev = this.configService.get('NODE_ENV') !== 'production';
            const host = isDev && endPoint === 'minio' ? 'localhost' : endPoint;
            const url = `http://${host}:${port}/${this.bucketName}/${filename}`;
            return url;
        }
        catch (error) {
            this.logger.error(`Erreur lors de l'upload du fichier : ${error.message}`, error.stack);
            throw new common_1.InternalServerErrorException("Impossible d'uploader le fichier");
        }
    }
    async deleteFile(fileUrl) {
        try {
            if (!fileUrl)
                return;
            const urlParts = new URL(fileUrl);
            const prefix = `/${this.bucketName}/`;
            const filename = urlParts.pathname.startsWith(prefix)
                ? urlParts.pathname.substring(prefix.length)
                : urlParts.pathname.substring(1);
            await this.minioClient.removeObject(this.bucketName, filename);
        }
        catch (error) {
            this.logger.error(`Erreur lors de la suppression du fichier : ${error.message}`, error.stack);
        }
    }
};
exports.StorageService = StorageService;
exports.StorageService = StorageService = StorageService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], StorageService);
//# sourceMappingURL=storage.service.js.map