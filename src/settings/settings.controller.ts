import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { SettingsService } from './settings.service';
import { Roles } from '../common/decorators/roles.decorator';
import { UserRole } from '../common/enums';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Settings')
@ApiBearerAuth('JWT-auth')
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  @ApiOperation({ summary: 'Récupérer les paramètres globaux' })
  @ApiResponse({ status: 200, description: 'Paramètres retournés.' })
  findAll() {
    return this.settingsService.getSettings();
  }

  @Public()
  @Get('features')
  @ApiOperation({ summary: 'Récupérer les fonctionnalités activées (public)' })
  async getFeatures() {
    const settings = await this.settingsService.getSettings();
    return settings.features ?? {
      otpRequired: process.env.OTP_REQUIRED !== 'false',
      paymentRequired: process.env.PAYMENT_REQUIRED !== 'false',
    };
  }

  @Patch()
  @Roles(UserRole.ADMIN_CLIENT, UserRole.SUPER_ADMIN, UserRole.ADMIN_MMS)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Mettre à jour les paramètres globaux (Super Admin uniquement)' })
  @ApiResponse({ status: 200, description: 'Paramètres mis à jour.' })
  update(@Body() data: any) {
    return this.settingsService.updateSettings(data);
  }
}
