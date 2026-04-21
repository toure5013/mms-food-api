import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { SettingsService } from './settings/settings.service';
import { Public } from './common/decorators/public.decorator';
import * as Enums from './common/enums';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly settingsService: SettingsService,
  ) { }

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('enums')
  @ApiOperation({ summary: 'Récupérer toutes les énumérations du système', description: 'Retourne un objet contenant toutes les énumérations (catégories de plats, rôles, statuts de commande, etc.) utilisées par l\'API.' })
  @ApiResponse({ status: 200, description: 'Objet contenant les énumérations.' })
  async getEnums() {
    const settings = await this.settingsService.getSettings();
    const customAllergies = settings.dietary?.customAllergies || [];
    const customRegimes = settings.dietary?.customRegimes || [];

    return {
      dishCategories: Object.values(Enums.DishCategory),
      userRoles: Object.values(Enums.UserRole),
      menuModes: Object.values(Enums.MenuMode),
      subventionTypes: Object.values(Enums.SubventionType),
      mealSlots: Object.values(Enums.MealSlot),
      orderStatuses: Object.values(Enums.OrderStatus),
      paymentMethods: Object.values(Enums.PaymentMethod),
      paymentStatuses: Object.values(Enums.PaymentStatus),
      notificationChannels: Object.values(Enums.NotificationChannel),
      financialModes: Object.values(Enums.FinancialMode),
      dietaryRegimes: [
        ...Object.values(Enums.DietaryRegime),
        ...customRegimes,
      ],
      allergies: [
        ...Object.values(Enums.Allergy),
        ...customAllergies,
      ],
    };
  }
}
