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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../users/user.entity");
let AuthService = class AuthService {
    userRepo;
    jwtService;
    constructor(userRepo, jwtService) {
        this.userRepo = userRepo;
        this.jwtService = jwtService;
    }
    async login(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email, is_active: true },
            select: ['id', 'email', 'password_hash', 'role', 'organisation_id', 'prenom', 'nom', 'is_first_login'],
            relations: ['organisation'],
        });
        if (!user)
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        if (!user.password_hash) {
            throw new common_1.UnauthorizedException('Compte non activé. Veuillez utiliser votre lien d\'invitation.');
        }
        const isValid = await bcrypt.compare(dto.password, user.password_hash);
        if (!isValid)
            throw new common_1.UnauthorizedException('Email ou mot de passe incorrect');
        return this.generateTokens(user);
    }
    async requestOtp(dto) {
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        if (!user)
            throw new common_1.NotFoundException('Aucun compte associé à cet email');
        const otpCode = this.generateOtp();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.userRepo.update(user.id, {
            otp_code: otpCode,
            otp_expires_at: expiresAt,
        });
        console.log(`[OTP] ${user.email} → ${otpCode}`);
        return { message: 'Code OTP envoyé par email', expires_in_minutes: 10 };
    }
    async verifyOtp(dto) {
        const user = await this.userRepo.findOne({
            where: { email: dto.email },
            select: ['id', 'email', 'otp_code', 'otp_expires_at', 'role', 'organisation_id'],
        });
        if (!user)
            throw new common_1.NotFoundException('Compte introuvable');
        if (!user.otp_code || user.otp_code !== dto.otp) {
            throw new common_1.BadRequestException('Code OTP invalide');
        }
        if (new Date() > user.otp_expires_at) {
            throw new common_1.BadRequestException('Code OTP expiré');
        }
        return { valid: true, message: 'OTP vérifié' };
    }
    async setPassword(dto) {
        await this.verifyOtp({ email: dto.email, otp: dto.otp });
        const user = await this.userRepo.findOne({ where: { email: dto.email } });
        const hash = await bcrypt.hash(dto.password, 12);
        if (!user)
            throw new common_1.NotFoundException('Compte introuvable');
        await this.userRepo.update(user.id, {
            password_hash: hash,
            otp_code: undefined,
            otp_expires_at: undefined,
            is_first_login: false,
        });
        return this.generateTokens(user);
    }
    generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
            organisation_id: user.organisation_id ?? null,
        };
        return {
            access_token: this.jwtService.sign(payload, { expiresIn: '15m' }),
            refresh_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
            user: {
                id: user.id,
                email: user.email,
                prenom: user.prenom,
                nom: user.nom,
                role: user.role,
                organisation_id: user.organisation_id,
                is_first_login: user.is_first_login,
            },
        };
    }
    generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map