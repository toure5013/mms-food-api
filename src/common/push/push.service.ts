import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getMessaging } from 'firebase-admin/messaging';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);
  private readonly app?: App;

  constructor(private readonly config: ConfigService) {
    const json = config.get<string>('FIREBASE_SERVICE_ACCOUNT_JSON');
    if (json && json !== '{}' && json.trim().startsWith('{')) {
      try {
        // Évite la double initialisation si le module est rechargé
        this.app = getApps().find((a) => a.name === 'mms-cantine')
          ?? initializeApp({ credential: cert(JSON.parse(json)) }, 'mms-cantine');
        this.logger.log('Firebase Admin initialisé (v14 modular)');
      } catch (e: any) {
        this.logger.warn(`Firebase Admin: init échouée — ${e?.message}`);
      }
    } else {
      this.logger.log('Firebase Admin: FIREBASE_SERVICE_ACCOUNT_JSON absent — push désactivé');
    }
  }

  async sendToToken(
    fcmToken: string,
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    if (!fcmToken?.trim()) return;
    if (!this.app) {
      this.logger.log(`[PUSH-MOCK] "${title}" → ${fcmToken.slice(0, 12)}…`);
      return;
    }
    try {
      await getMessaging(this.app).send({ token: fcmToken, notification: { title, body }, data });
    } catch (err: any) {
      this.logger.error(`Push échoué → ${fcmToken.slice(0, 12)}: ${err?.message}`);
    }
  }

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    data?: Record<string, string>,
  ): Promise<void> {
    const valid = tokens.filter(Boolean);
    if (valid.length === 0) return;
    await Promise.allSettled(valid.map((t) => this.sendToToken(t, title, body, data)));
  }
}
