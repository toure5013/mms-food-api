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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const settings_entity_1 = require("./settings.entity");
let SettingsService = class SettingsService {
    settingsRepo;
    constructor(settingsRepo) {
        this.settingsRepo = settingsRepo;
    }
    async onModuleInit() {
        const count = await this.settingsRepo.count();
        if (count === 0) {
            await this.settingsRepo.save({
                id: 1,
                general: {
                    platformName: "MMS — Matin Midi Soir",
                    contactEmail: "admin@mms.ci",
                    phone: "+225 27 XX XX XX XX",
                    timezone: "Africa/Abidjan",
                    currency: "FCFA (XOF)"
                },
                branding: {
                    primaryColor: "#E87722",
                    logoUrl: "https://mms.ci/logo.png",
                    displayName: "MMS Admin"
                },
                notifs: {
                    lateDelivery: true,
                    paymentFailed: true,
                    newRegistration: false,
                    dailyReport: true,
                    lowStock: true
                },
                security: {
                    twoFactorAuth: true,
                    autoLogout: false,
                    auditLogs: true,
                    jwtExpiration: "7d"
                },
                org: {
                    companyName: "Matin Midi Soir SARL",
                    rccm: "CI-ABJ-2024-B-12345",
                    address: "Cocody, Abidjan, Côte d'Ivoire",
                    morningService: "07:00 – 10:00",
                    noonService: "11:30 – 14:00",
                    eveningService: "18:00 – 21:00"
                },
                dietary: {
                    customAllergies: [],
                    customRegimes: []
                }
            });
        }
    }
    async getSettings() {
        const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
        if (!settings) {
            return this.settingsRepo.save({ id: 1 });
        }
        return settings;
    }
    async updateSettings(data) {
        const settings = await this.getSettings();
        Object.assign(settings, data);
        return this.settingsRepo.save(settings);
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(settings_entity_1.Settings)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], SettingsService);
//# sourceMappingURL=settings.service.js.map