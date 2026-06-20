export declare class Settings {
    id: number;
    general: any;
    branding: any;
    notifs: any;
    security: any;
    org: any;
    dietary: {
        customAllergies: string[];
        customRegimes: string[];
    };
    features: {
        otpRequired: boolean;
        paymentRequired: boolean;
    };
    created_at: Date;
    updated_at: Date;
}
