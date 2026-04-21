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
    created_at: Date;
    updated_at: Date;
}
