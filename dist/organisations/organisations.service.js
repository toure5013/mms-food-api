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
exports.OrganisationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organisation_entity_1 = require("./organisation.entity");
let OrganisationsService = class OrganisationsService {
    organisationRepo;
    constructor(organisationRepo) {
        this.organisationRepo = organisationRepo;
    }
    findAll() {
        return this.organisationRepo.find({
            order: { created_at: 'DESC' },
        });
    }
    async findOne(id) {
        const org = await this.organisationRepo.findOne({ where: { id } });
        if (!org)
            throw new common_1.NotFoundException('Organisation introuvable');
        return org;
    }
    create(dto) {
        const org = this.organisationRepo.create(dto);
        return this.organisationRepo.save(org);
    }
    async update(id, dto) {
        const org = await this.findOne(id);
        Object.assign(org, dto);
        return this.organisationRepo.save(org);
    }
    async remove(id) {
        const org = await this.findOne(id);
        return this.organisationRepo.remove(org);
    }
};
exports.OrganisationsService = OrganisationsService;
exports.OrganisationsService = OrganisationsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(organisation_entity_1.Organisation)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], OrganisationsService);
//# sourceMappingURL=organisations.service.js.map