import { AppService } from './app.service';
import { SettingsService } from './settings/settings.service';
import * as Enums from './common/enums';
export declare class AppController {
    private readonly appService;
    private readonly settingsService;
    constructor(appService: AppService, settingsService: SettingsService);
    getHello(): string;
    getEnums(): Promise<{
        dishCategories: Enums.DishCategory[];
        userRoles: Enums.UserRole[];
        menuModes: Enums.MenuMode[];
        subventionTypes: Enums.SubventionType[];
        mealSlots: Enums.MealSlot[];
        orderStatuses: Enums.OrderStatus[];
        paymentMethods: Enums.PaymentMethod[];
        paymentStatuses: Enums.PaymentStatus[];
        notificationChannels: Enums.NotificationChannel[];
        financialModes: Enums.FinancialMode[];
        dietaryRegimes: string[];
        allergies: string[];
    }>;
}
