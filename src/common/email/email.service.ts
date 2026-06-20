import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly enabled: boolean;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const apiKey = config.get<string>('SENDGRID_API_KEY');
    this.from = config.get<string>('SENDGRID_FROM', 'noreply@mms.ci');
    this.enabled = !!apiKey;

    if (this.enabled && apiKey) {
      sgMail.setApiKey(apiKey);
    } else {
      this.logger.warn('SENDGRID_API_KEY non définie — emails désactivés (mode console)');
    }
  }

  async sendOtp(to: string, otp: string, prenom?: string): Promise<void> {
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
    } catch (err) {
      this.logger.error(`Échec envoi OTP à ${to}: ${err?.message}`);
    }
  }

  async sendWelcome(to: string, prenom: string, otp: string): Promise<void> {
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
    } catch (err) {
      this.logger.error(`Échec envoi welcome à ${to}: ${err?.message}`);
    }
  }
}
