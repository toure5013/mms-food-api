import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto, RequestOtpDto, VerifyOtpDto, SetPasswordDto } from './dto/auth.dto';
import { UserRole } from '../common/enums/index';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /** LOGIN: email + mot de passe */
  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email, is_active: true },
      select: ['id', 'email', 'password_hash', 'role', 'organisation_id', 'prenom', 'nom', 'is_first_login'],
      relations: ['organisation'],
    });

    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');
    if (!user.password_hash) {
      throw new UnauthorizedException('Compte non activé. Veuillez utiliser votre lien d\'invitation.');
    }

    const isValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isValid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    return this.generateTokens(user);
  }

  /** DEMANDE OTP: pour première connexion OU reset mot de passe */
  async requestOtp(dto: RequestOtpDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Aucun compte associé à cet email');

    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    await this.userRepo.update(user.id, {
      otp_code: otpCode,
      otp_expires_at: expiresAt,
    });

    // TODO: envoyer l'email via NotificationsService
    console.log(`[OTP] ${user.email} → ${otpCode}`);

    return { message: 'Code OTP envoyé par email', expires_in_minutes: 10 };
  }

  /** VÉRIFICATION OTP */
  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email },
      select: ['id', 'email', 'otp_code', 'otp_expires_at', 'role', 'organisation_id'],
    });

    if (!user) throw new NotFoundException('Compte introuvable');
    if (!user.otp_code || user.otp_code !== dto.otp) {
      throw new BadRequestException('Code OTP invalide');
    }
    if (new Date() > user.otp_expires_at) {
      throw new BadRequestException('Code OTP expiré');
    }

    return { valid: true, message: 'OTP vérifié' };
  }

  /** DÉFINIR/RÉINITIALISER mot de passe (après OTP valide) */
  async setPassword(dto: SetPasswordDto) {
    // Re-vérifier l'OTP
    await this.verifyOtp({ email: dto.email, otp: dto.otp });

    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    const hash = await bcrypt.hash(dto.password, 12);

    if (!user) throw new NotFoundException('Compte introuvable');
    await this.userRepo.update(user.id, {
      password_hash: hash,
      otp_code: undefined as any,
      otp_expires_at: undefined as any,
      is_first_login: false,
    });

    return this.generateTokens(user);
  }

  /** Génère JWT access + refresh */
  private generateTokens(user: Partial<User>) {
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

  /** Génère OTP à 6 chiffres */
  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
