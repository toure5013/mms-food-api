import { ConfigService } from '@nestjs/config';
import { PaymentMethod } from '../common/enums/index';
export interface InitiatePaymentResult {
    checkout_url: string;
    provider_reference: string;
}
export declare class PaymentProviderService {
    private readonly config;
    private readonly logger;
    constructor(config: ConfigService);
    initiate(method: PaymentMethod, amount: number, reference: string, phone?: string): Promise<InitiatePaymentResult>;
    private initiateWave;
    private initiateCinetPay;
    private initiatePayDunya;
}
