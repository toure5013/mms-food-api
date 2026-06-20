import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private readonly config;
    private readonly logger;
    private readonly enabled;
    private readonly from;
    constructor(config: ConfigService);
    sendOtp(to: string, otp: string, prenom?: string): Promise<void>;
    sendWelcome(to: string, prenom: string, otp: string): Promise<void>;
}
