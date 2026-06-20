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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var PaymentProviderService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentProviderService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const index_1 = require("../common/enums/index");
const axios_1 = __importDefault(require("axios"));
let PaymentProviderService = PaymentProviderService_1 = class PaymentProviderService {
    config;
    logger = new common_1.Logger(PaymentProviderService_1.name);
    constructor(config) {
        this.config = config;
    }
    async initiate(method, amount, reference, phone) {
        switch (method) {
            case index_1.PaymentMethod.WAVE:
                return this.initiateWave(amount, reference, phone);
            case index_1.PaymentMethod.ORANGE_MONEY:
            case index_1.PaymentMethod.MTN:
                return this.initiateCinetPay(method, amount, reference, phone);
            case index_1.PaymentMethod.CINETPAY:
                return this.initiateCinetPay(method, amount, reference, phone);
            case index_1.PaymentMethod.PAYDUNYA:
                return this.initiatePayDunya(amount, reference);
            default:
                throw new common_1.BadRequestException(`Méthode de paiement non supportée pour initiation: ${method}`);
        }
    }
    async initiateWave(amount, reference, phone) {
        const apiKey = this.config.get('WAVE_API_KEY');
        if (!apiKey) {
            this.logger.warn('[WAVE] WAVE_API_KEY non configuré — mode simulation');
            return {
                checkout_url: `https://checkout.wave.com/mock?ref=${reference}&amount=${amount}`,
                provider_reference: `WAVE-MOCK-${reference}`,
            };
        }
        const successUrl = this.config.get('APP_BASE_URL', 'https://mms-api.sissos.togoom.com') + `/api/v1/payments/webhook`;
        const errorUrl = successUrl;
        try {
            const resp = await axios_1.default.post('https://api.wave.com/v1/checkout/sessions', {
                amount: String(amount),
                currency: 'XOF',
                client_reference: reference,
                success_url: successUrl,
                error_url: errorUrl,
                ...(phone ? { receive_amount: String(amount) } : {}),
            }, { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } });
            return {
                checkout_url: resp.data.wave_launch_url ?? resp.data.checkout_url,
                provider_reference: resp.data.id,
            };
        }
        catch (err) {
            this.logger.error(`Wave initiation échouée: ${err?.response?.data?.message ?? err?.message}`);
            throw new common_1.BadRequestException(`Paiement Wave échoué: ${err?.response?.data?.message ?? 'Erreur provider'}`);
        }
    }
    async initiateCinetPay(method, amount, reference, phone) {
        const apiKey = this.config.get('CINETPAY_API_KEY');
        const siteId = this.config.get('CINETPAY_SITE_ID');
        if (!apiKey || !siteId) {
            this.logger.warn('[CINETPAY] Clés non configurées — mode simulation');
            return {
                checkout_url: `https://checkout.cinetpay.com/mock?ref=${reference}&amount=${amount}`,
                provider_reference: `CINETPAY-MOCK-${reference}`,
            };
        }
        const notifyUrl = this.config.get('APP_BASE_URL', 'https://mms-api.sissos.togoom.com') + `/api/v1/payments/webhook`;
        try {
            const resp = await axios_1.default.post('https://api-checkout.cinetpay.com/v2/payment', {
                apikey: apiKey,
                site_id: siteId,
                transaction_id: reference,
                amount,
                currency: 'XOF',
                description: `Paiement commande MMS ${reference}`,
                notify_url: notifyUrl,
                channels: method === index_1.PaymentMethod.ORANGE_MONEY ? 'ORANGE_MONEY' : method === index_1.PaymentMethod.MTN ? 'MTN' : 'ALL',
                ...(phone ? { customer_phone_number: phone } : {}),
            });
            const data = resp.data?.data;
            return {
                checkout_url: data?.payment_url ?? '',
                provider_reference: data?.payment_token ?? reference,
            };
        }
        catch (err) {
            this.logger.error(`CinetPay initiation échouée: ${err?.response?.data?.message ?? err?.message}`);
            throw new common_1.BadRequestException(`Paiement CinetPay échoué: ${err?.response?.data?.message ?? 'Erreur provider'}`);
        }
    }
    async initiatePayDunya(amount, reference) {
        const masterKey = this.config.get('PAYDUNYA_MASTER_KEY');
        if (!masterKey) {
            this.logger.warn('[PAYDUNYA] PAYDUNYA_MASTER_KEY non configuré — mode simulation');
            return {
                checkout_url: `https://app.paydunya.com/mock?ref=${reference}&amount=${amount}`,
                provider_reference: `PAYDUNYA-MOCK-${reference}`,
            };
        }
        const baseUrl = this.config.get('APP_BASE_URL', 'https://mms-api.sissos.togoom.com');
        try {
            const resp = await axios_1.default.post('https://app.paydunya.com/api/v1/checkout-invoice/create', {
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
            }, {
                headers: {
                    'PAYDUNYA-MASTER-KEY': masterKey,
                    'PAYDUNYA-PRIVATE-KEY': this.config.get('PAYDUNYA_PRIVATE_KEY', ''),
                    'PAYDUNYA-TOKEN': this.config.get('PAYDUNYA_TOKEN', ''),
                    'Content-Type': 'application/json',
                },
            });
            return {
                checkout_url: resp.data.response_text ?? '',
                provider_reference: resp.data.token ?? reference,
            };
        }
        catch (err) {
            this.logger.error(`PayDunya initiation échouée: ${err?.message}`);
            throw new common_1.BadRequestException(`Paiement PayDunya échoué: ${err?.message ?? 'Erreur provider'}`);
        }
    }
};
exports.PaymentProviderService = PaymentProviderService;
exports.PaymentProviderService = PaymentProviderService = PaymentProviderService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], PaymentProviderService);
//# sourceMappingURL=payment-provider.service.js.map