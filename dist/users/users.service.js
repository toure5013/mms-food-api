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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./user.entity");
const index_1 = require("../common/enums/index");
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
        if (currentUser?.role === index_1.UserRole.ADMIN_CLIENT) {
            const allowed = [index_1.UserRole.EMPLOYEE, index_1.UserRole.COOK, index_1.UserRole.SERVER];
            if (!allowed.includes(dto.role)) {
                throw new common_1.ForbiddenException(`Un admin client ne peut créer que les rôles : ${allowed.join(', ')}`);
            }
            dto.organisation_id = currentUser.organisation_id;
        }
        const user = this.userRepo.create({ ...dto, is_first_login: true, is_active: true });
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