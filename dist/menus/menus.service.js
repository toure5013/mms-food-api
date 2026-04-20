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
exports.MenusService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const menu_entity_1 = require("./menu.entity");
const dish_entity_1 = require("../dishes/dish.entity");
const organisation_entity_1 = require("../organisations/organisation.entity");
const common_2 = require("@nestjs/common");
let MenusService = class MenusService {
    menuRepo;
    dishRepo;
    orgRepo;
    constructor(menuRepo, dishRepo, orgRepo) {
        this.menuRepo = menuRepo;
        this.dishRepo = dishRepo;
        this.orgRepo = orgRepo;
    }
    findAll(organisationId, date) {
        const where = {};
        if (organisationId)
            where.organisation_id = organisationId;
        if (date)
            where.date = date;
        return this.menuRepo.find({
            where,
            relations: ['plats', 'organisation'],
            order: { date: 'DESC', creneau: 'ASC' },
        });
    }
    async findOne(id) {
        const menu = await this.menuRepo.findOne({
            where: { id },
            relations: ['plats', 'organisation'],
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu introuvable');
        return menu;
    }
    async create(dto) {
        const { plats_ids, ...menuData } = dto;
        const organisation = await this.orgRepo.findOne({ where: { id: dto.organisation_id } });
        if (!organisation)
            throw new common_1.NotFoundException('Organisation introuvable');
        const menu = this.menuRepo.create(menuData);
        if (plats_ids?.length) {
            const plats = await this.dishRepo.find({
                where: { id: (0, typeorm_2.In)(plats_ids) },
            });
            await this.validateMenuSaaSRules(organisation, plats);
            menu.plats = plats;
        }
        return this.menuRepo.save(menu);
    }
    async update(id, dto) {
        const menu = await this.findOne(id);
        const { plats_ids, ...updateData } = dto;
        const organisation = menu.organisation || await this.orgRepo.findOne({ where: { id: menu.organisation_id } });
        Object.assign(menu, updateData);
        if (plats_ids) {
            const plats = await this.dishRepo.find({
                where: { id: (0, typeorm_2.In)(plats_ids) },
            });
            await this.validateMenuSaaSRules(organisation, plats);
            menu.plats = plats;
        }
        return this.menuRepo.save(menu);
    }
    async validateMenuSaaSRules(organisation, plats) {
        let totalMenuPrice = 0;
        for (const dish of plats) {
            if (organisation.prix_max_plats > 0 && Number(dish.prix) > Number(organisation.prix_max_plats)) {
                throw new common_2.BadRequestException(`Le plat "${dish.nom}" dépasse le prix maximum autorisé par l'organisation (${organisation.prix_max_plats} FCFA).`);
            }
            if (organisation.composition_menu && organisation.composition_menu.length > 0) {
                if (!organisation.composition_menu.includes(dish.categorie)) {
                    throw new common_2.BadRequestException(`La catégorie "${dish.categorie}" du plat "${dish.nom}" n'est pas autorisée par l'organisation.`);
                }
            }
            totalMenuPrice += Number(dish.prix);
        }
        if (organisation.prix_max_menu > 0 && totalMenuPrice > Number(organisation.prix_max_menu)) {
            throw new common_2.BadRequestException(`Le prix total du menu (${totalMenuPrice} FCFA) dépasse le maximum autorisé (${organisation.prix_max_menu} FCFA).`);
        }
    }
    async publish(id, isPublished) {
        const menu = await this.findOne(id);
        menu.is_published = isPublished;
        if (isPublished) {
            menu.published_at = new Date();
        }
        return this.menuRepo.save(menu);
    }
    async remove(id) {
        const menu = await this.findOne(id);
        return this.menuRepo.remove(menu);
    }
    async findDailyDishes(date, organisationId) {
        const where = { date, is_published: true };
        if (organisationId)
            where.organisation_id = organisationId;
        const menus = await this.menuRepo.find({
            where,
            relations: ['plats'],
        });
        const allDishes = menus.flatMap((m) => m.plats);
        const uniqueDishes = Array.from(new Map(allDishes.map((d) => [d.id, d])).values());
        return uniqueDishes;
    }
};
exports.MenusService = MenusService;
exports.MenusService = MenusService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(menu_entity_1.Menu)),
    __param(1, (0, typeorm_1.InjectRepository)(dish_entity_1.Dish)),
    __param(2, (0, typeorm_1.InjectRepository)(organisation_entity_1.Organisation)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], MenusService);
//# sourceMappingURL=menus.service.js.map