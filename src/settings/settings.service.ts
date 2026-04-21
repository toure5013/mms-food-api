import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';

@Injectable()
export class SettingsService implements OnModuleInit {
  constructor(
    @InjectRepository(Settings)
    private readonly settingsRepo: Repository<Settings>,
  ) {}

  async onModuleInit() {
    // S'assurer qu'au moins une ligne de paramètres existe au démarrage
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

  async getSettings(): Promise<Settings> {
    const settings = await this.settingsRepo.findOne({ where: { id: 1 } });
    if (!settings) {
      // Cas de secours si onModuleInit n'a pas fini
      return this.settingsRepo.save({ id: 1 });
    }
    return settings;
  }

  async updateSettings(data: Partial<Settings>): Promise<Settings> {
    const settings = await this.getSettings();
    Object.assign(settings, data);
    return this.settingsRepo.save(settings);
  }
}
