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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const index_1 = require("../common/enums/index");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userRepo;
    constructor(userRepo) {
        this.userRepo = userRepo;
    }
    findAll(organisationId, role) {
        const where = {};
        if (organisationId)
            where.organisation_id = organisationId;
        if (role)
            where.role = role;
        return this.userRepo.find({
            where,
            relations: ['organisation'],
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const user = await this.userRepo.findOne({
            where: { id },
            relations: ['organisation']
        });
        if (!user)
            throw new common_1.NotFoundException('Utilisateur introuvable');
        return user;
    }
    async create(dto, currentUser) {
        const existingUser = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existingUser) {
            throw new common_1.ConflictException('Un utilisateur avec cet email existe déjà');
        }
        if (currentUser?.role === index_1.UserRole.ADMIN_CLIENT) {
            const allowed = [index_1.UserRole.EMPLOYEE, index_1.UserRole.COOK, index_1.UserRole.SERVER];
            if (!allowed.includes(dto.role)) {
                throw new common_1.ForbiddenException(`Un admin client ne peut créer que les rôles : ${allowed.join(', ')}`);
            }
            dto.organisation_id = currentUser.organisation_id;
        }
        else if (currentUser?.role === index_1.UserRole.ADMIN_MMS) {
            const forbidden = [index_1.UserRole.SUPER_ADMIN];
            if (forbidden.includes(dto.role)) {
                throw new common_1.ForbiddenException('Un ADMIN_MMS ne peut pas créer de SUPER_ADMIN');
            }
        }
        const hash = dto.password ? await bcrypt.hash(dto.password, 12) : undefined;
        const user = this.userRepo.create({
            prenom: dto.prenom,
            nom: dto.nom,
            email: dto.email,
            role: dto.role,
            organisation_id: dto.organisation_id,
            telephone: dto.telephone,
            avatar_url: dto.avatar_url,
            service: dto.service,
            regimes: dto.regimes,
            allergies: dto.allergies,
            password_hash: hash,
            is_first_login: !dto.password,
            is_active: true
        });
        return this.userRepo.save(user);
    }
    async update(id, dto, currentUser) {
        const user = await this.findOne(id);
        if (currentUser?.role === index_1.UserRole.ADMIN_CLIENT) {
            if (user.organisation_id !== currentUser.organisation_id) {
                throw new common_1.ForbiddenException('Accès refusé — cet utilisateur n\'appartient pas à votre organisation');
            }
        }
        Object.assign(user, dto);
        return this.userRepo.save(user);
    }
    async toggleActive(id, currentUser) {
        const user = await this.findOne(id);
        if (currentUser.role === index_1.UserRole.ADMIN_CLIENT) {
            if (user.organisation_id !== currentUser.organisation_id) {
                throw new common_1.ForbiddenException('Accès refusé — cet utilisateur n\'appartient pas à votre organisation');
            }
        }
        user.is_active = !user.is_active;
        return this.userRepo.save(user);
    }
    async remove(id) {
        const user = await this.findOne(id);
        return this.userRepo.remove(user);
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map