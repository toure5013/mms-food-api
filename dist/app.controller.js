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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const openapi = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const app_service_1 = require("./app.service");
const settings_service_1 = require("./settings/settings.service");
const public_decorator_1 = require("./common/decorators/public.decorator");
const Enums = __importStar(require("./common/enums"));
let AppController = class AppController {
    appService;
    settingsService;
    constructor(appService, settingsService) {
        this.appService = appService;
        this.settingsService = settingsService;
    }
    getHello() {
        return this.appService.getHello();
    }
    async getEnums() {
        const settings = await this.settingsService.getSettings();
        const customAllergies = settings.dietary?.customAllergies || [];
        const customRegimes = settings.dietary?.customRegimes || [];
        return {
            dishCategories: Object.values(Enums.DishCategory),
            userRoles: Object.values(Enums.UserRole),
            menuModes: Object.values(Enums.MenuMode),
            subventionTypes: Object.values(Enums.SubventionType),
            mealSlots: Object.values(Enums.MealSlot),
            orderStatuses: Object.values(Enums.OrderStatus),
            paymentMethods: Object.values(Enums.PaymentMethod),
            paymentStatuses: Object.values(Enums.PaymentStatus),
            notificationChannels: Object.values(Enums.NotificationChannel),
            financialModes: Object.values(Enums.FinancialMode),
            dietaryRegimes: [
                ...Object.values(Enums.DietaryRegime),
                ...customRegimes,
            ],
            allergies: [
                ...Object.values(Enums.Allergy),
                ...customAllergies,
            ],
        };
    }
};
exports.AppController = AppController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)(),
    openapi.ApiResponse({ status: 200, type: String }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('enums'),
    (0, swagger_1.ApiOperation)({ summary: 'Récupérer toutes les énumérations du système', description: 'Retourne un objet contenant toutes les énumérations (catégories de plats, rôles, statuts de commande, etc.) utilisées par l\'API.' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Objet contenant les énumérations.' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppController.prototype, "getEnums", null);
exports.AppController = AppController = __decorate([
    (0, swagger_1.ApiTags)('System'),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [app_service_1.AppService,
        settings_service_1.SettingsService])
], AppController);
//# sourceMappingURL=app.controller.js.map