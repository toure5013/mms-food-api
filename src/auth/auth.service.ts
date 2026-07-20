import {
  Injectable, UnauthorizedException, BadRequestException,
  NotFoundException, Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { LoginDto, RequestOtpDto, VerifyOtpDto, SetPasswordDto, RefreshTokenDto, ChangePasswordDto } from './dto/auth.dto';
import { EmailService } from '../common/email/email.service';
import { SettingsService } from '../settings/settings.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly settingsService: SettingsService,
  ) {}

  async login(dto: LoginDto) {
    const user = await this.userRepo.findOne({
      where: { email: dto.email, is_active: true },
      select: ['id', 'email', 'password_hash', 'role', 'organisation_id', 'prenom', 'nom', 'is_first_login', 'loyalty_points'],
      relations: ['organisation', 'wallet'],
    });

    if (!user) throw new UnauthorizedException('Email ou mot de passe incorrect');

    if (!user.password_hash) {
      throw new UnauthorizedException("Compte non activé. Utilisez le lien d'invitation.");
    }

    const isValid = await bcrypt.compare(dto.password, user.password_hash);
    if (!isValid) throw new UnauthorizedException('Email ou mot de passe incorrect');

    if (user.organisation && !user.organisation.is_active) {
      throw new UnauthorizedException('Votre entreprise est bloquée. Contactez le super-administrateur.');
    }

    this.logger.log(`Connexion: ${user.email} (${user.role})`);
    return this.generateTokens(user);
  }

  async requestOtp(dto: RequestOtpDto) {
    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Aucun compte associé à cet email');

    const settings = await this.settingsService.getSettings();
    const otpRequired = settings.features?.otpRequired !== false;

    const otpCode = this.generateOtp();
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min for bypass mode too
    await this.userRepo.update(user.id, { otp_code: otpCode, otp_expires_at: expiresAt });

    if (otpRequired) {
      await this.emailService.sendOtp(user.email, otpCode, user.prenom);
      return { message: 'Code OTP envoyé par email', expires_in_minutes: 10, otp_disabled: false };
    }

    // OTP désactivé : renvoyer le code directement (pas d'email)
    this.logger.log(`OTP désactivé — code fourni directement pour ${user.email}`);
    return { message: 'OTP désactivé — code de réinitialisation fourni', expires_in_minutes: 30, otp_disabled: true, auto_code: otpCode };
  }

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

  async setPassword(dto: SetPasswordDto) {
    await this.verifyOtp({ email: dto.email, otp: dto.otp });

    const user = await this.userRepo.findOne({ where: { email: dto.email } });
    if (!user) throw new NotFoundException('Compte introuvable');

    const hash = await bcrypt.hash(dto.password, 12);
    await this.userRepo.update(user.id, {
      password_hash: hash,
      otp_code: null as any,
      otp_expires_at: null as any,
      is_first_login: false,
    });

    return this.generateTokens(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.userRepo.findOne({
      where: { id: userId },
      select: ['id', 'email', 'password_hash'],
    });
    if (!user) throw new NotFoundException('Utilisateur introuvable');

    const isValid = await bcrypt.compare(dto.current_password, user.password_hash);
    if (!isValid) throw new UnauthorizedException('Mot de passe actuel incorrect');

    const hash = await bcrypt.hash(dto.new_password, 12);
    await this.userRepo.update(user.id, { password_hash: hash, is_first_login: false });

    return { message: 'Mot de passe mis à jour avec succès' };
  }

  async refresh(dto: RefreshTokenDto) {
    let payload: any;
    try {
      payload = this.jwtService.verify(dto.refresh_token);
    } catch {
      throw new UnauthorizedException('Refresh token invalide ou expiré');
    }

    const user = await this.userRepo.findOne({
      where: { id: payload.sub, is_active: true },
      select: ['id', 'email', 'role', 'organisation_id', 'prenom', 'nom', 'is_first_login', 'loyalty_points'],
    });

    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const newPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organisation_id: user.organisation_id ?? null,
    };

    return {
      access_token: this.jwtService.sign(newPayload, { expiresIn: '30d' }),
      type_token: 'Bearer',
    };
  }

  async getProfile(userId: string) {
    if (!userId) throw new BadRequestException('ID utilisateur manquant');

    const user = await this.userRepo.findOne({
      where: { id: userId },
      relations: ['organisation', 'wallet'],
    });

    if (!user) throw new NotFoundException('Utilisateur introuvable');
    return user;
  }

  private generateTokens(user: Partial<User>) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      organisation_id: user.organisation_id ?? null,
    };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      refresh_token: this.jwtService.sign(payload, { expiresIn: '30d' }),
      type_token: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        prenom: user.prenom,
        nom: user.nom,
        role: user.role,
        organisation_id: user.organisation_id,
        is_first_login: user.is_first_login,
        loyalty_points: user.loyalty_points,
        wallet: user.wallet ? { solde: user.wallet.solde } : null,
      },
    };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
}
