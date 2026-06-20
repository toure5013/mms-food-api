import { ConfigService } from '@nestjs/config';
export declare class PushService {
    private readonly config;
    private readonly logger;
    private readonly app?;
    constructor(config: ConfigService);
    sendToToken(fcmToken: string, title: string, body: string, data?: Record<string, string>): Promise<void>;
    sendToTokens(tokens: string[], title: string, body: string, data?: Record<string, string>): Promise<void>;
}
