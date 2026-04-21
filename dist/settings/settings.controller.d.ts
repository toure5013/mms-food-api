import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    findAll(): Promise<import("./settings.entity").Settings>;
    update(data: any): Promise<import("./settings.entity").Settings>;
}
