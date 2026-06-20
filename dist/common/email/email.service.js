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
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const sgMail = __importStar(require("@sendgrid/mail"));
let EmailService = EmailService_1 = class EmailService {
    config;
    logger = new common_1.Logger(EmailService_1.name);
    enabled;
    from;
    constructor(config) {
        this.config = config;
        const apiKey = config.get('SENDGRID_API_KEY');
        this.from = config.get('SENDGRID_FROM', 'noreply@mms.ci');
        this.enabled = !!apiKey;
        if (this.enabled && apiKey) {
            sgMail.setApiKey(apiKey);
        }
        else {
            this.logger.warn('SENDGRID_API_KEY non définie — emails désactivés (mode console)');
        }
    }
    async sendOtp(to, otp, prenom) {
        const subject = 'Votre code de vérification MMS';
        const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#E87722">MMS — Matin Midi Soir</h2>
        <p>Bonjour ${prenom || ''},</p>
        <p>Voici votre code de vérification :</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;
                    background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0">
          ${otp}
        </div>
        <p>Ce code expire dans <strong>10 minutes</strong>.</p>
        <p style="color:#999;font-size:12px">Si vous n'avez pas demandé ce code, ignorez cet email.</p>
      </div>
    `;
        if (!this.enabled) {
            this.logger.log(`[EMAIL-OTP] To: ${to} | Code: ${otp}`);
            return;
        }
        try {
            await sgMail.send({ to, from: this.from, subject, html });
        }
        catch (err) {
            this.logger.error(`Échec envoi OTP à ${to}: ${err?.message}`);
        }
    }
    async sendWelcome(to, prenom, otp) {
        const subject = 'Bienvenue sur MMS — Activez votre compte';
        const html = `
      <div style="font-family:sans-serif;max-width:480px;margin:auto">
        <h2 style="color:#E87722">Bienvenue sur MMS !</h2>
        <p>Bonjour ${prenom},</p>
        <p>Votre compte a été créé. Utilisez ce code pour définir votre mot de passe :</p>
        <div style="font-size:36px;font-weight:bold;letter-spacing:8px;text-align:center;
                    background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0">
          ${otp}
        </div>
        <p>Ce code expire dans <strong>10 minutes</strong>.</p>
      </div>
    `;
        if (!this.enabled) {
            this.logger.log(`[EMAIL-WELCOME] To: ${to} | Code: ${otp}`);
            return;
        }
        try {
            await sgMail.send({ to, from: this.from, subject, html });
        }
        catch (err) {
            this.logger.error(`Échec envoi welcome à ${to}: ${err?.message}`);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map