import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Settings } from './settings.entity';
export declare class SettingsService implements OnModuleInit {
    private readonly settingsRepo;
    constructor(settingsRepo: Repository<Settings>);
    onModuleInit(): Promise<void>;
    getSettings(): Promise<Settings>;
    updateSettings(data: Partial<Settings>): Promise<Settings>;
}
