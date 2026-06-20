import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaymentMethod } from '../common/enums/index';
import axios from 'axios';

export interface InitiatePaymentResult {
  checkout_url: string;
  provider_reference: string;
}

@Injectable()
export class PaymentProviderService {
  private readonly logger = new Logger(PaymentProviderService.name);

  constructor(private readonly config: ConfigService) {}

  async initiate(
    method: PaymentMethod,
    amount: number,
    reference: string,
    phone?: string,
  ): Promise<InitiatePaymentResult> {
    switch (method) {
      case PaymentMethod.WAVE:
        return this.initiateWave(amount, reference, phone);
      case PaymentMethod.ORANGE_MONEY:
      case PaymentMethod.MTN:
        return this.initiateCinetPay(method, amount, reference, phone);
      case PaymentMethod.CINETPAY:
        return this.initiateCinetPay(method, amount, reference, phone);
      case PaymentMethod.PAYDUNYA:
        return this.initiatePayDunya(amount, reference);
      default:
        throw new BadRequestException(`Méthode de paiement non supportée pour initiation: ${method}`);
    }
  }

  // ─── Wave Senegal ───────────────────────────────────────────────────────

  private async initiateWave(amount: number, reference: string, phone?: string): Promise<InitiatePaymentResult> {
    const apiKey = this.config.get<string>('WAVE_API_KEY');
    if (!apiKey) {
      this.logger.warn('[WAVE] WAVE_API_KEY non configuré — mode simulation');
      return {
        checkout_url: `https://checkout.wave.com/mock?ref=${reference}&amount=${amount}`,
        provider_reference: `WAVE-MOCK-${reference}`,
      };
    }

    const successUrl = this.config.get<string>('APP_BASE_URL', 'https://mms-api.sissos.togoom.com') + `/api/v1/payments/webhook`;
    const errorUrl = successUrl;

    try {
      const resp = await axios.post(
        'https://api.wave.com/v1/checkout/sessions',
        {
          amount: String(amount),
          currency: 'XOF',
          client_reference: reference,
          success_url: successUrl,
          error_url: errorUrl,
          ...(phone ? { receive_amount: String(amount) } : {}),
        },
        { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } },
      );
      return {
        checkout_url: resp.data.wave_launch_url ?? resp.data.checkout_url,
        provider_reference: resp.data.id,
      };
    } catch (err: any) {
      this.logger.error(`Wave initiation échouée: ${err?.response?.data?.message ?? err?.message}`);
      throw new BadRequestException(`Paiement Wave échoué: ${err?.response?.data?.message ?? 'Erreur provider'}`);
    }
  }

  // ─── CinetPay ──────────────────────────────────────────────────────────

  private async initiateCinetPay(method: PaymentMethod, amount: number, reference: string, phone?: string): Promise<InitiatePaymentResult> {
    const apiKey = this.config.get<string>('CINETPAY_API_KEY');
    const siteId = this.config.get<string>('CINETPAY_SITE_ID');

    if (!apiKey || !siteId) {
      this.logger.warn('[CINETPAY] Clés non configurées — mode simulation');
      return {
        checkout_url: `https://checkout.cinetpay.com/mock?ref=${reference}&amount=${amount}`,
        provider_reference: `CINETPAY-MOCK-${reference}`,
      };
    }

    const notifyUrl = this.config.get<string>('APP_BASE_URL', 'https://mms-api.sissos.togoom.com') + `/api/v1/payments/webhook`;

    try {
      const resp = await axios.post('https://api-checkout.cinetpay.com/v2/payment', {
        apikey: apiKey,
        site_id: siteId,
        transaction_id: reference,
        amount,
        currency: 'XOF',
        description: `Paiement commande MMS ${reference}`,
        notify_url: notifyUrl,
        channels: method === PaymentMethod.ORANGE_MONEY ? 'ORANGE_MONEY' : method === PaymentMethod.MTN ? 'MTN' : 'ALL',
        ...(phone ? { customer_phone_number: phone } : {}),
      });

      const data = resp.data?.data;
      return {
        checkout_url: data?.payment_url ?? '',
        provider_reference: data?.payment_token ?? reference,
      };
    } catch (err: any) {
      this.logger.error(`CinetPay initiation échouée: ${err?.response?.data?.message ?? err?.message}`);
      throw new BadRequestException(`Paiement CinetPay échoué: ${err?.response?.data?.message ?? 'Erreur provider'}`);
    }
  }

  // ─── PayDunya ──────────────────────────────────────────────────────────

  private async initiatePayDunya(amount: number, reference: string): Promise<InitiatePaymentResult> {
    const masterKey = this.config.get<string>('PAYDUNYA_MASTER_KEY');
    if (!masterKey) {
      this.logger.warn('[PAYDUNYA] PAYDUNYA_MASTER_KEY non configuré — mode simulation');
      return {
        checkout_url: `https://app.paydunya.com/mock?ref=${reference}&amount=${amount}`,
        provider_reference: `PAYDUNYA-MOCK-${reference}`,
      };
    }

    const baseUrl = this.config.get<string>('APP_BASE_URL', 'https://mms-api.sissos.togoom.com');
    try {
      const resp = await axios.post(
        'https://app.paydunya.com/api/v1/checkout-invoice/create',
        {
          invoice: {
            total_amount: amount,
            description: `Commande MMS ${reference}`,
          },
          store: { name: 'MMS Cantine' },
          actions: {
            cancel_url: baseUrl,
            return_url: `${baseUrl}/api/v1/payments/webhook?ref=${reference}`,
            callback_url: `${baseUrl}/api/v1/payments/webhook`,
          },
        },
        {
          headers: {
            'PAYDUNYA-MASTER-KEY': masterKey,
            'PAYDUNYA-PRIVATE-KEY': this.config.get<string>('PAYDUNYA_PRIVATE_KEY', ''),
            'PAYDUNYA-TOKEN': this.config.get<string>('PAYDUNYA_TOKEN', ''),
            'Content-Type': 'application/json',
          },
        },
      );
      return {
        checkout_url: resp.data.response_text ?? '',
        provider_reference: resp.data.token ?? reference,
      };
    } catch (err: any) {
      this.logger.error(`PayDunya initiation échouée: ${err?.message}`);
      throw new BadRequestException(`Paiement PayDunya échoué: ${err?.message ?? 'Erreur provider'}`);
    }
  }
}
