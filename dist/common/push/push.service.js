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
var PushService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PushService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_1 = require("firebase-admin/app");
const messaging_1 = require("firebase-admin/messaging");
let PushService = PushService_1 = class PushService {
    config;
    logger = new common_1.Logger(PushService_1.name);
    app;
    constructor(config) {
        this.config = config;
        const json = config.get('FIREBASE_SERVICE_ACCOUNT_JSON');
        if (json && json !== '{}' && json.trim().startsWith('{')) {
            try {
                this.app = (0, app_1.getApps)().find((a) => a.name === 'mms-cantine')
                    ?? (0, app_1.initializeApp)({ credential: (0, app_1.cert)(JSON.parse(json)) }, 'mms-cantine');
                this.logger.log('Firebase Admin initialisé (v14 modular)');
            }
            catch (e) {
                this.logger.warn(`Firebase Admin: init échouée — ${e?.message}`);
            }
        }
        else {
            this.logger.log('Firebase Admin: FIREBASE_SERVICE_ACCOUNT_JSON absent — push désactivé');
        }
    }
    async sendToToken(fcmToken, title, body, data) {
        if (!fcmToken?.trim())
            return;
        if (!this.app) {
            this.logger.log(`[PUSH-MOCK] "${title}" → ${fcmToken.slice(0, 12)}…`);
            return;
        }
        try {
            await (0, messaging_1.getMessaging)(this.app).send({ token: fcmToken, notification: { title, body }, data });
        }
        catch (err) {
            this.logger.error(`Push échoué → ${fcmToken.slice(0, 12)}: ${err?.message}`);
        }
    }
    async sendToTokens(tokens, title, body, data) {
        const valid = tokens.filter(Boolean);
        if (valid.length === 0)
            return;
        await Promise.allSettled(valid.map((t) => this.sendToToken(t, title, body, data)));
    }
};
exports.PushService = PushService;
exports.PushService = PushService = PushService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PushService);
//# sourceMappingURL=push.service.js.map